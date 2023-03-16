import * as Amq from 'amqplib';
import { log } from '../../utils';
import {
  BroadcastMessage,
  BroadcastMessageContentMapper,
  BroadcastOptions,
  MessageHandler,
} from '../broadcast.types';
import { AmqMessageHandlersState } from './broadcast.amq.enums';
import { BroadcastAmqMessage } from './broadcast.amq.message';
import { ConsumerOptions } from './broadcast.amq.types';

/**
 * @class
 */
export class BroadcastAmqMessageHandlers {
  private state: AmqMessageHandlersState;
  private channel: Amq.Channel;

  constructor(
    private channelOptions: BroadcastOptions,
    private handlersByQueues: Map<string, MessageHandler<Amq.Message>[]> = new Map<
      string,
      MessageHandler<Amq.Message>[]
    >(),
    private consumersByQueues: Map<string, ConsumerOptions> = new Map<
      string,
      ConsumerOptions
    >()
  ) {}

  private async executeHandler(
    message: Amq.Message,
    handler: MessageHandler<BroadcastMessage>,
    mapper: BroadcastMessageContentMapper
  ): Promise<void> {
    const {
      properties: { messageId },
      content,
    } = message;
    const data = mapper ? await mapper.toContent(content).catch(log) : content;
    handler(new BroadcastAmqMessage(messageId, data, message)).catch(log);
  }

  public useChannel(channel: Amq.Channel): void {
    this.channel = channel;
  }

  /**
   * Set up a listener for the queue.
   *
   * @param {string} queue - queue name
   * @param {MessageHandler} handler - queue handler
   */
  public async assign(
    name: string,
    handler: MessageHandler<BroadcastMessage>
  ): Promise<void> {
    try {
      const { mapper, fireAndForget } =
        this.channelOptions.queues.find(queue => queue.name === name) || {};

      //
      if (this.handlersByQueues.has(name)) {
        this.handlersByQueues.get(name).push(handler);
      } else {
        this.handlersByQueues.set(name, [handler]);
      }
      //
      if (this.consumersByQueues.has(name)) {
        this.consumersByQueues.delete(name);
      }
      //
      const consumerOptions = await this.channel.consume(
        name,
        async (message: Amq.Message) => this.executeHandler(message, handler, mapper),
        {
          noAck: Boolean(fireAndForget),
        }
      );
      this.consumersByQueues.set(name, consumerOptions);
    } catch (error) {
      log(error);
    }
  }

  /**
   * Reassign queue handlers stored in the 'handlers' map.
   * This function is called when the connection is restored
   *
   * @async
   */
  public async restore(): Promise<void> {
    if (this.state === AmqMessageHandlersState.Idle) {
      this.state = AmqMessageHandlersState.Restoring;
      const promises = [];
      this.handlersByQueues.forEach(
        (handlers: MessageHandler<Amq.Message>[], queue: string) => {
          handlers.forEach(handler => promises.push(this.assign(queue, handler)));
        }
      );
      await Promise.all(promises);
      this.state = AmqMessageHandlersState.Idle;
    }
  }

  public clear(): void {
    if (this.state === AmqMessageHandlersState.Idle) {
      this.state = AmqMessageHandlersState.Cancleing;
      this.consumersByQueues.forEach(options => {
        if (options.consumerTag) {
          this.channel.cancel(options.consumerTag);
        }
      });
      this.consumersByQueues.clear();
      this.state = AmqMessageHandlersState.Idle;
    }
  }
}
