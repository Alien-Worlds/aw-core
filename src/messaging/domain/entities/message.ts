/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MessageDto } from '../../data/messaging.dtos';
import { MessageFields, MessageProperties } from 'amqplib';

export class Message {
  /**
   * @private
   * @constructor
   * @param {string} id
   * @param {Buffer} content
   * @param {MessageFields} fields
   * @param {MessageProperties} properties
   */
  private constructor(
    public readonly id: string,
    public readonly content: Buffer,
    private readonly fields: MessageFields,
    private readonly properties: MessageProperties
  ) {}

  /**
   * Get DTO from Message entity
   * @returns {MessageDto}
   */
  public toDto(): MessageDto {
    const { content, properties, fields } = this;
    return {
      content,
      fields,
      properties,
    };
  }

  /**
   * Create Message instance based on DTO.
   *
   * @static
   * @param {MessageDto} dto
   */
  public static fromDto(dto: MessageDto): Message {
    const { content, fields, properties } = dto;
    return new Message(properties.messageId, content, fields, properties);
  }
}
