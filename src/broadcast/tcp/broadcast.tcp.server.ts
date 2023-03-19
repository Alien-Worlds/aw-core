import { BroadcastTcpStash } from './broadcast.tcp.stash';
import { createServer, Server, Socket } from 'net';
import {
  BroadcastConnectionConfig,
  BroadcastMessage,
  BroadcastServer,
  ClientMessageHandler,
} from '../broadcast.types';
import {
  BroadcastTcpSystemMessage,
  BroadcastTcpMessage,
  BroadcastTcpMessageType,
  BroadcastTcpMessageName,
  BroadcastClientConnectedData,
  BroadcastMessageHandlerData,
} from './broadcast.tcp.message';
import {
  getTcpConnectionOptions,
  splitToMessageBuffers,
  getClientAddress,
} from './broadcast.tcp.utils';
import { BroadcastTcpClientCast } from './broadcast.tcp.client-cast';
import { BroadcastTcpChannel } from './broadcast.tcp.channel';
import { log } from '../../utils';

export class BroadcastTcpServer implements BroadcastServer {
  protected server: Server;
  protected clients: BroadcastTcpClientCast[] = [];
  protected channelsByName: Map<string, BroadcastTcpChannel> = new Map();
  protected stash: BroadcastTcpStash = new BroadcastTcpStash();
  protected clientMessageHandler: ClientMessageHandler<BroadcastMessage>;

  constructor(protected config: BroadcastConnectionConfig) {}

  protected resendStashedMessages(client: BroadcastTcpClientCast, channel: string) {
    const messages = this.stash.pop(channel);
    for (const message of messages) {
      const {
        id,
        content: { channel, name },
      } = message;
      client.send(message);
      log(
        `Broadcast TCP Server: message (${JSON.stringify({
          id,
          channel,
          name,
        })}) has been resent.`
      );
    }
  }

  protected onClientConnected(socket: Socket, data: BroadcastClientConnectedData) {
    const { name, channels } = data;
    const address = getClientAddress(socket, false);
    let client = this.clients.find(client => client.address === address);

    if (!client) {
      client = new BroadcastTcpClientCast(socket, name);
      this.clients.push(client);
    }

    log(
      `Broadcast TCP Server: client ${client.address} (${client.name}) connection open.`
    );

    for (const channel of channels) {
      if (this.channelsByName.has(channel)) {
        this.channelsByName.get(channel).addClient(client);
      } else {
        this.channelsByName.set(channel, new BroadcastTcpChannel(channel, [client]));
      }
      // if there are any undelivered messages, then send them
      // to the first client that listens to the selected channel
      this.resendStashedMessages(client, channel);
    }
  }

  protected onClientAddedMessageHandler(
    socket: Socket,
    data: BroadcastMessageHandlerData
  ) {
    const { channel } = data;
    const address = getClientAddress(socket, false);
    const client = this.clients.find(client => client.address === address);

    if (client) {
      log(
        `Broadcast TCP Server: client ${client.address} (${client.name}) is listening to channel "${channel}".`
      );

      if (this.channelsByName.has(channel)) {
        this.channelsByName.get(channel).addClient(client);
      } else {
        this.channelsByName.set(channel, new BroadcastTcpChannel(channel, [client]));
      }
      // if there are any undelivered messages, then send them
      // to the first client that listens to the selected channel
      this.resendStashedMessages(client, channel);
    }
  }

  protected onClientRemovedMessageHandler(
    socket: Socket,
    data: BroadcastMessageHandlerData
  ) {
    const { channel } = data;
    const address = getClientAddress(socket, false);
    const client = this.clients.find(client => client.address === address);

    if (this.channelsByName.has(channel) && client) {
      log(
        `Broadcast TCP Server: client ${client.address} (${client.name}) has stopped listening to channel "${channel}".`
      );
      this.channelsByName.get(channel).removeClient(address);
    }
  }

  protected onClientDisconnected(socket: Socket) {
    const address = getClientAddress(socket, false);
    const i = this.clients.findIndex(client => client.address === address);

    if (i) {
      this.clients.splice(i);
    }

    this.channelsByName.forEach(channel => {
      channel.removeClient(address);
    });

    log(`Broadcast TCP Server: client ${address} connection closed.`);
  }

  protected onClientIncomingMessage(socket: Socket, message: BroadcastTcpMessage) {
    const { content } = message;
    const address = getClientAddress(socket, false);
    const client = this.clients.find(client => client.address === address);
    let success = false;

    //TODO: type direct or subscibe

    if (this.clientMessageHandler) {
      this.clientMessageHandler(client, message);
    }

    if (this.channelsByName.has(content.channel)) {
      const channel = this.channelsByName.get(content.channel);
      success = channel.sendMessage(new BroadcastTcpMessage(content), [address]);
    }

    if (!success) {
      client.send(BroadcastTcpSystemMessage.createMessageNotDelivered(message));

      if (message.persistent) {
        this.stash.add(message);
      }
    }
  }

  protected onClientError(socket: Socket, error: Error) {
    const address = getClientAddress(socket, false);
    this.channelsByName.forEach(channel => {
      channel.removeClient(address);
    });
    log(`Broadcast TCP Server: client ${address} connection error: ${error.message}`);
  }

  protected handleClientMessage(socket: Socket, buffer: Buffer) {
    const message = BroadcastTcpMessage.fromBuffer(buffer);
    const {
      content: { type, data, name },
    } = message;
    if (
      type === BroadcastTcpMessageType.System &&
      name === BroadcastTcpMessageName.ClientConnected
    ) {
      this.onClientConnected(socket, <BroadcastClientConnectedData>data);
    } else if (
      type === BroadcastTcpMessageType.System &&
      name === BroadcastTcpMessageName.ClientAddedMessageHandler
    ) {
      this.onClientAddedMessageHandler(socket, <BroadcastMessageHandlerData>data);
    } else if (
      type === BroadcastTcpMessageType.System &&
      name === BroadcastTcpMessageName.ClientRemovedMessageHandler
    ) {
      this.onClientRemovedMessageHandler(socket, <BroadcastMessageHandlerData>data);
    } else if (type === BroadcastTcpMessageType.Data) {
      this.onClientIncomingMessage(socket, message);
    }
  }

  public async start(): Promise<void> {
    this.server = createServer();

    this.server.on('connection', socket => {
      socket.on('data', buffer => {
        const buffers = splitToMessageBuffers(buffer);
        buffers.forEach(buffer => {
          this.handleClientMessage(socket, buffer);
        });
      });
      socket.on('error', error => this.onClientError(socket, error));
      socket.once('close', () => this.onClientDisconnected(socket));
    });

    const options = getTcpConnectionOptions(this.config);

    this.server.listen(options, () => {
      log(`Broadcast TCP Server: listening on ${JSON.stringify(options)}`);
    });
  }

  public onClientMessage(
    handler: ClientMessageHandler<BroadcastMessage<unknown, unknown>>
  ): void {
    this.clientMessageHandler = handler;
  }

  public sendChannelMessage(
    channel: string,
    message: BroadcastMessage<unknown, unknown>
  ): void {
    if (this.channelsByName.has(channel)) {
      this.channelsByName.get(channel).sendMessage(<BroadcastTcpMessage>message);
    } else {
      log(
        `Broadcast TCP Server: channel "${channel}" does not exist. Message cannot be sent.`
      );
    }
  }

  public sendDirectMessage(
    addressesOrNames: string[],
    message: BroadcastMessage<unknown, unknown>
  ): void {
    const recipients = this.clients.filter(
      client =>
        addressesOrNames.includes(client.address) ||
        addressesOrNames.includes(client.name)
    );

    if (recipients.length === 0) {
      log(
        `Broadcast TCP Server: No clients with given addresses were found. Message cannot be sent.`
      );
    }

    recipients.forEach(recipient => {
      recipient.send(<BroadcastTcpMessage>message);
    });
  }
}
