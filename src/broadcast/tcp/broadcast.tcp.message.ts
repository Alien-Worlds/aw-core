import { nanoid } from 'nanoid';
import { deserialize, serialize } from 'v8';
import { BroadcastMessage } from '../broadcast.types';

export enum BroadcastTcpMessageType {
  Data = 'DATA',
  System = 'SYSTEM',
}

export enum BroadcastTcpMessageName {
  Undefined = 'UNDEFINED',
  ClientConnected = 'CLIENT_CONNECTED',
  ClientDisconnected = 'CLIENT_DISCONNECTED',
  ClientAddedMessageHandler = 'ADDED_MESSAGE_HANDLER',
  ClientRemovedMessageHandler = 'REMOVED_MESSAGE_HANDLER',
  MessageDelivered = 'MESSAGE_DELIVERED',
  MessageNotDelivered = 'MESSAGE_NOT_DELIVERED',
}

export type BroadcastTcpMessageContent<DataType = unknown> = {
  sender: string;
  channel: string;
  type: string;
  name: string;
  receiver?: string;
  data?: DataType;
};

export type BroadcastClientConnectedData = {
  name: string;
  channels: string[];
};

export type BroadcastClientDisonnectedData = {
  name: string;
};

export type BroadcastMessageDeliveryData = {
  id: string;
  content: BroadcastTcpMessageContent;
};

export type BroadcastMessageHandlerData = {
  channel: string;
};

export class BroadcastTcpMessage<ContentType = unknown> implements BroadcastMessage {
  public static fromBuffer<DataType = unknown>(
    buffer: Buffer
  ): BroadcastTcpMessage<DataType> {
    const content = deserialize(buffer) as BroadcastTcpMessageContent<DataType>;

    return new BroadcastTcpMessage(content);
  }

  public source: unknown;
  public id: string = nanoid();

  constructor(
    public readonly content: BroadcastTcpMessageContent<ContentType>,
    public readonly persistent = true
  ) {}

  public toBuffer(): Buffer {
    return serialize(this.content);
  }
}

export class BroadcastTcpSystemMessage extends BroadcastTcpMessage {
  public static createClientConnected(
    name: string,
    senderAddress: string,
    channels: string[]
  ) {
    return new BroadcastTcpSystemMessage({
      sender: senderAddress,
      channel: null,
      name: BroadcastTcpMessageName.ClientConnected,
      type: BroadcastTcpMessageType.System,
      data: { name, channels },
    });
  }

  public static createClientDisconnected(name: string, senderAddress: string) {
    return new BroadcastTcpSystemMessage({
      sender: senderAddress,
      channel: null,
      name: BroadcastTcpMessageName.ClientDisconnected,
      type: BroadcastTcpMessageType.System,
      data: { name },
    });
  }

  public static createMessageDelivered(message: BroadcastTcpMessage) {
    const { id, content } = message;
    return new BroadcastTcpSystemMessage({
      sender: null,
      receiver: message.content.sender,
      channel: null,
      name: BroadcastTcpMessageName.MessageDelivered,
      type: BroadcastTcpMessageType.System,
      data: { id, content },
    });
  }

  public static createMessageNotDelivered(message: BroadcastTcpMessage) {
    const { id, content } = message;
    return new BroadcastTcpSystemMessage({
      sender: null,
      receiver: message.content.sender,
      channel: null,
      name: BroadcastTcpMessageName.MessageNotDelivered,
      type: BroadcastTcpMessageType.System,
      data: { id, content },
    });
  }

  public static createClientAddedMessageHandler(channel: string, senderAddress: string) {
    return new BroadcastTcpSystemMessage({
      sender: senderAddress,
      channel: null,
      name: BroadcastTcpMessageName.ClientAddedMessageHandler,
      type: BroadcastTcpMessageType.System,
      data: { channel },
    });
  }

  public static createClientRemovedMessageHandler(
    channel: string,
    senderAddress: string
  ) {
    return new BroadcastTcpSystemMessage({
      sender: senderAddress,
      channel: null,
      name: BroadcastTcpMessageName.ClientRemovedMessageHandler,
      type: BroadcastTcpMessageType.System,
      data: { channel },
    });
  }
}
