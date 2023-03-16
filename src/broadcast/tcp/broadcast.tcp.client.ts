import { Socket } from 'net';
import { ConnectionState } from '../broadcast.enums';
import {
  BroadcastClient,
  BroadcastConnectionConfig,
  BroadcastMessage,
  MessageHandler,
} from '../broadcast.types';
import { BroadcastTcpMessageQueue } from './broadcast.tcp.message-queue';
import {
  BroadcastMessageDeliveryData,
  BroadcastTcpMessage,
  BroadcastTcpMessageName,
  BroadcastTcpMessageType,
  BroadcastTcpSystemMessage,
} from './broadcast.tcp.message';
import {
  getClientAddress,
  getTcpConnectionOptions,
  splitToMessageBuffers,
} from './broadcast.tcp.utils';
import { log, wait } from '../../utils';

export class BroadcastTcpClient implements BroadcastClient {
  private socket: Socket;
  private address: string;
  private messageQueue: BroadcastTcpMessageQueue;
  private connectionOptions: { path?: string; host?: string; port?: number };
  private connectionState: ConnectionState = ConnectionState.Offline;
  private channelHandlers: Map<string, MessageHandler<BroadcastMessage>> = new Map();

  constructor(public readonly name: string, config: BroadcastConnectionConfig) {
    this.connectionOptions = getTcpConnectionOptions(config);
    this.socket = new Socket();

    this.messageQueue = new BroadcastTcpMessageQueue(this.socket);
    this.socket.on('connect', () => {
      this.connectionState = ConnectionState.Online;
      const address = getClientAddress(this.socket, true);
      this.address = address;

      log(`Broadcast - ${JSON.stringify({ name, address })}: connected to the server.`);

      const message = BroadcastTcpSystemMessage.createClientConnected(
        this.name,
        this.address,
        Array.from(this.channelHandlers.keys())
      );

      this.messageQueue.add(message);
      this.messageQueue.start();
    });
    this.socket.on('end', () => {
      const { name, address } = this;
      this.connectionState = ConnectionState.Offline;
      log(
        `Broadcast - ${JSON.stringify({ name, address })}: disconnected from the server.`
      );
      this.messageQueue.stop();
      this.reconnect();
    });
    this.socket.on('error', error => {
      const { name, address } = this;
      this.connectionState = ConnectionState.Offline;
      log(`Broadcast - ${JSON.stringify({ name, address })}: Error: ${error.message}`);
      this.messageQueue.stop();
      this.reconnect();
    });
    this.socket.on('data', buffer => {
      const buffers = splitToMessageBuffers(buffer);

      for (const buffer of buffers) {
        const message = BroadcastTcpMessage.fromBuffer(buffer);
        const {
          content: { type, channel },
        } = message;

        if (type === BroadcastTcpMessageType.System) {
          this.onSystemMessage(<BroadcastTcpSystemMessage>message);
        } else {
          const handler = this.channelHandlers.get(channel);
          if (handler) {
            handler(message);
          }
        }
      }
    });
  }

  private onSystemMessage(message: BroadcastTcpSystemMessage) {
    const {
      content: { data, name },
    } = message;

    if (name === BroadcastTcpMessageName.MessageNotDelivered) {
      const {
        id,
        content: { channel, name },
      } = <BroadcastMessageDeliveryData>data;

      log(
        `Broadcast - ${this.name}: message (${JSON.stringify({
          id,
          channel,
          name,
        })}) was not delivered.`
      );
    }
  }

  private async reconnect() {
    if (this.connectionState === ConnectionState.Offline) {
      await wait(5000);
      this.connect();
    }
  }

  public connect() {
    if (this.connectionState === ConnectionState.Offline) {
      this.connectionState = ConnectionState.Connecting;
      const { path, port, host } = this.connectionOptions;
      this.socket.connect({ path, port, host });
    }
  }

  public sendMessage<DataType = unknown>(content: {
    channel: string;
    data?: DataType;
    name?: string;
  }): void {
    const { channel, data, name } = content;
    const message = new BroadcastTcpMessage({
      sender: this.address,
      channel,
      type: BroadcastTcpMessageType.Data,
      name: name || BroadcastTcpMessageName.Undefined,
      data,
    });
    this.messageQueue.add(message);
  }

  public onMessage(channel: string, handler: MessageHandler<BroadcastMessage>): void {
    this.channelHandlers.set(channel, handler);
    this.messageQueue.add(
      BroadcastTcpSystemMessage.createClientAddedMessageHandler(channel, this.address)
    );
  }
}
