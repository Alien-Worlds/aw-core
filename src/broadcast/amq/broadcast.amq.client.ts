import * as Amq from 'amqplib';
import { BroadcastError } from '../broadcast.errors';
import { BroadcastClient, BroadcastMessage, BroadcastOptions } from '../broadcast.types';
import { ConnectionStateHandler, MessageHandler } from '../broadcast.types';
import { ConnectionState } from '../broadcast.enums';
import { BroadcastAmqMessageHandlers } from './broadcast.amq.message-handlers';
import { BroadcastAmqConnection } from './broadcast.amq.connection';
import { BroadcastAmqMessageDispatcher } from './broadcast.amq.message-dispatcher';
import { log } from '../../utils';

/**
 * @class
 */
export class BroadcastAmqClient implements BroadcastClient {
  private channel: Amq.Channel;
  private connection: BroadcastAmqConnection;
  private initialized: boolean;
  private messageHandlers: BroadcastAmqMessageHandlers;
  private messageDispatcher: BroadcastAmqMessageDispatcher;

  /**
   * @constructor
   * @param {string} address - connection string
   * @param {ChannelOptions} channelOptions - channel options
   * @param {Console} logger - logger instance
   */
  constructor(
    address: string,
    public channelOptions: BroadcastOptions,
    private logger: Console
  ) {
    this.initialized = false;
    this.messageHandlers = new BroadcastAmqMessageHandlers(this.channelOptions);
    this.messageDispatcher = new BroadcastAmqMessageDispatcher(channelOptions);
    this.connection = new BroadcastAmqConnection(address, async (channel: Amq.Channel) =>
      this.setupChannel(channel)
    );
  }

  private async handleChannelCancel() {
    this.connection.disconnect();
  }

  private async handleChannelClose() {
    this.connection.disconnect();
  }

  private async handleChannelError(error: unknown) {
    this.connection.disconnect(error);
  }

  /**
   * Create channel and set up queues.
   *
   * @private
   * @async
   */
  private async setupChannel(channel: Amq.Channel): Promise<void> {
    const { prefetch, queues } = this.channelOptions;

    this.channel = channel;
    this.channel.on('cancel', () => this.handleChannelCancel());
    this.channel.on('close', () => this.handleChannelClose());
    this.channel.on('error', error => this.handleChannelError(error));
    log(`      >  Channel created.`);

    await this.channel.prefetch(prefetch);
    for (const queue of queues) {
      await this.channel.assertQueue(queue.name, queue.options);
    }

    this.messageHandlers.useChannel(channel);
    this.messageDispatcher.useChannel(channel);

    this.initialized = true;
    log(`      >  Queues set up.`);
  }

  /**
   * Initialize driver
   *
   * @async
   */
  public async connect(): Promise<void> {
    if (!this.initialized) {
      await this.connection.connect();
    }
  }

  /**
   * Send a single message with the content given as a buffer to the specific queue named, bypassing routing.
   *
   * @param {string} queue
   * @param {Buffer} message
   */
  public sendMessage<DataType = unknown>(message: {
    channel: string;
    name: string;
    data: DataType;
  }): void {
    const { name, data } = message;
    this.messageDispatcher.sendMessage(name, data);
  }

  public onError(handler: (error: BroadcastError) => void) {
    this.messageDispatcher.errorHandler = handler;
  }

  public onMessageSent(handler: (...args: unknown[]) => void) {
    this.messageDispatcher.sentHandler = handler;
  }

  /**
   * Set up a listener for the queue.
   *
   * @param {string} queue - queue name
   * @param {MessageHandler} handler - queue handler
   */
  public async onMessage(
    name: string,
    handler: MessageHandler<BroadcastMessage>
  ): Promise<void> {
    return this.messageHandlers.assign(name, handler);
  }

  public cancel(): void {
    this.messageHandlers.clear();
  }

  public resume(): Promise<void> {
    return this.messageHandlers.restore();
  }

  /**
   * Acknowledge the message.
   *
   * @param {Message} message
   */
  public ack(message: BroadcastMessage<Amq.Message>): void {
    this.messageDispatcher.ack(message.source);
  }

  /**
   * Reject a message.
   * Negative acknowledgement - set a message as not delivered and should be discarded.
   *
   * @param {Message} message
   */
  public reject(message: BroadcastMessage<Amq.Message>, requeue?: boolean): void {
    this.messageDispatcher.reject(message.source, requeue);
  }

  /**
   *
   * @param {ConnectionState} state
   * @param {ConnectionStateHandler} handler
   */
  public addConnectionStateHandler(
    state: ConnectionState,
    handler: ConnectionStateHandler
  ): void {
    this.connection.addConnectionStateHandler(state, handler);
  }

  /**
   *
   * @param {ConnectionState} state
   */
  public removeConnectionStateHandlers(state?: ConnectionState): void {
    this.connection.removeConnectionStateHandlers(state);
  }
}
