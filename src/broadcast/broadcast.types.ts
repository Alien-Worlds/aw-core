export type BroadcastConnectionConfig = {
  url?: string;
  port?: number;
  host?: string;
};

export type BroadcastConfig = BroadcastConnectionConfig & {
  driver: string;
  clientName?: string;
  queues?: { [key: string]: OptionalQueueOptions };
};

export type OptionalQueueOptions = {
  name?: string;
  options?: { durable?: boolean };
  mapper?: BroadcastMessageContentMapper;
  fireAndForget?: boolean;
};

export type QueueOptions = {
  name: string;
  options: { durable: boolean };
  mapper?: BroadcastMessageContentMapper;
  fireAndForget: boolean;
};

export type BroadcastOptions = {
  prefetch: number;
  queues: QueueOptions[];
};

export type MessageHandler<BroadcastMessageType> = (
  message: BroadcastMessageType
) => Promise<void>;

export type ClientMessageHandler<BroadcastMessageType> = (
  socket: BroadcastClientCast,
  message: BroadcastMessageType
) => Promise<void>;

export type ConnectionStateHandler = (...args: unknown[]) => Promise<void>;

export type BroadcastMessageContent<DataType = unknown> = {
  channel: string;
  name: string;
  data?: DataType;
};

/**
 * @abstract
 * @class
 */
export abstract class BroadcastMessage<ContentType = unknown, SourceType = unknown> {
  public id: string;
  public content: ContentType;
  public source: SourceType;
}

/**
 * @abstract
 * @class
 */
export abstract class BroadcastMessageContentMapper<ContentType = unknown> {
  public abstract toContent(buffer: Buffer): Promise<ContentType>;
  public abstract toBuffer(content: ContentType): Buffer;
}


/**
 * @abstract
 * @class
 */
export abstract class BroadcastClient {
  public abstract connect(): void;
  public abstract sendMessage<DataType = unknown>(
    message: BroadcastMessageContent<DataType>
  ): void;
  public abstract onMessage(
    channel: string,
    handler: MessageHandler<BroadcastMessage>
  ): void;
}

/**
 * @abstract
 * @class
 */
export abstract class BroadcastServer {
  public abstract start(): Promise<void>;
  public abstract onClientMessage(handler: ClientMessageHandler<BroadcastMessage>): void;
  public abstract sendMessageToChannel(channel: string, data: unknown, name?: string): void;
  public abstract sendMessageToClients(
    clients: BroadcastClientCast[] | string[],
    data: unknown
  ): void;
}

export abstract class BroadcastClientCast {
  public abstract get address(): string;
  public abstract addChannel(channel: string): void;
  public abstract removeChannel(channel: string): void;
  public abstract send(message: BroadcastMessage): void;
}
