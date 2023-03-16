import * as Amq from 'amqplib';
import { nanoid } from 'nanoid';
import { log } from '../../utils';
import {
  BroadcastError,
  BroadcastSendError,
  MapperNotFoundError,
} from '../broadcast.errors';
import { BroadcastOptions } from '../broadcast.types';

/**
 * @class
 */
export class BroadcastAmqMessageDispatcher {
  private channel: Amq.Channel;

  constructor(
    private channelOptions: BroadcastOptions,
    public errorHandler?: (error: BroadcastError) => void,
    public sentHandler?: (...args: unknown[]) => void
  ) {}

  public useChannel(channel: Amq.Channel) {
    this.channel = channel;
  }

  /**
   * Send a single message with the content given as a buffer to the specific queue named, bypassing routing.
   *
   * @async
   * @param {string} queue
   * @param {Buffer} message
   */
  public async sendMessage(name: string, message?: unknown): Promise<void> {
    const { mapper } =
      this.channelOptions.queues.find(queue => queue.name === name) || {};
    let error: Error;
    let success: boolean;

    if (mapper && message) {
      success = await this.channel.sendToQueue(name, mapper.toBuffer(message), {
        deliveryMode: true,
        messageId: nanoid(),
      });
    } else if (!mapper && !message) {
      success = await this.channel.sendToQueue(name, Buffer.from([]), {
        deliveryMode: true,
        messageId: nanoid(),
      });
    } else {
      error = new MapperNotFoundError(name);
      success = false;
    }

    if (!success && this.errorHandler) {
      this.errorHandler(new BroadcastSendError(error));
    } else if (success && this.sentHandler) {
      this.sentHandler();
    }
  }

  /**
   * Acknowledge the message.
   *
   * @param {Message} message
   */
  public ack(message: Amq.Message): void {
    try {
      this.channel.ack(message);
    } catch (error) {
      log(`Failed to ack message`, error);
    }
  }

  /**
   * Reject a message.
   * Negative acknowledgement - set a message as not delivered and should be discarded.
   *
   * @param {Message} message
   */
  public reject(message: Amq.Message, requeue = false): void {
    try {
      this.channel.reject(message, requeue);
    } catch (error) {
      log(`Failed to reject message`, error);
    }
  }
}
