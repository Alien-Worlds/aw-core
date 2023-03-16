/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Amq from 'amqplib';
import { BroadcastMessage } from '../broadcast.types';

export class BroadcastAmqMessage<ContentType = unknown>
  implements BroadcastMessage<ContentType>
{
  /**
   * @constructor
   * @param {string} id
   * @param {ContentType} content
   * @param {SourceType} _source
   */
  constructor(
    public readonly id: string,
    public readonly content: ContentType,
    private readonly _source: Amq.Message
  ) {}

  public get source(): Amq.Message {
    return this._source;
  }
}
