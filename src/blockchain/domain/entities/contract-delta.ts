import crypto from 'crypto';
import { serialize } from 'v8';
import { Entity } from '../../../architecture/domain/entity';
import { parseToBigInt, removeUndefinedProperties } from '../../../utils';
import { ContractDeltaModel } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';

/**
 * Represents a contract delta.
 * @class
 * @implements {Entity}
 * @template DataEntityType - The type of the data associated with the contract delta. Default is `Entity`.
 */
export class ContractDelta<DataEntityType extends Entity = Entity> implements Entity {
  /**
   * Creates a new instance of `ContractDelta` based on the provided model.
   * @static
   * @param {ContractDeltaModel<DataEntityType>} model - The model representing the contract delta.
   * @returns {ContractDelta<DataEntityType>} A new instance of `ContractDelta`.
   */
  public static create<DataEntityType extends Entity = Entity>(
    model: ContractDeltaModel<DataEntityType>
  ): ContractDelta<DataEntityType> {
    const {
      id,
      blockNumber,
      code,
      scope,
      table,
      data,
      payer,
      primaryKey,
      present,
      blockTimestamp,
    } = model;

    const dataBuffer = serialize(data);
    const dataHash = crypto.createHash('sha1').update(dataBuffer).digest('hex');

    return new ContractDelta(
      id,
      parseToBigInt(blockNumber),
      code,
      scope,
      table,
      dataHash,
      data,
      payer,
      parseToBigInt(primaryKey),
      present,
      blockTimestamp
    );
  }

  /**
   * Creates an instance of `ContractDelta`.
   *
   * @constructor
   * @param {string} id - The identifier of the contract delta.
   * @param {bigint} blockNumber - The block number of the contract delta.
   * @param {string} code - The code associated with the contract delta.
   * @param {string} scope - The scope of the contract delta.
   * @param {string} table - The table name of the contract delta.
   * @param {string} dataHash - The hash of the data associated with the contract delta.
   * @param {DataEntityType} data - The data associated with the contract delta.
   * @param {string} payer - The account name of the payer.
   * @param {bigint} primaryKey - The primary key value of the contract delta.
   * @param {number} present - The present flag value of the contract delta.
   * @param {Date} blockTimestamp - The block timestamp of the contract delta.
   */
  constructor(
    public readonly id: string,
    public readonly blockNumber: bigint,
    public readonly code: string,
    public readonly scope: string,
    public readonly table: string,
    public readonly dataHash: string,
    public readonly data: DataEntityType,
    public readonly payer: string,
    public readonly primaryKey: bigint,
    public readonly present: number,
    public readonly blockTimestamp: Date
  ) {}

  /**
   * Serializes the `ContractDelta` instance to a JSON object.
   * @returns {UnknownObject} The serialized JSON object representing the `ContractDelta`.
   */
  public toJSON(): UnknownObject {
    const {
      id,
      blockNumber,
      code,
      scope,
      table,
      dataHash,
      data,
      payer,
      primaryKey,
      present,
      blockTimestamp,
    } = this;

    const json = {
      id,
      block_timestamp: blockTimestamp.toISOString(),
      block_number: blockNumber.toString(),
      code,
      scope,
      table,
      payer,
      primaryKey,
      present,
      data: data.toJSON(),
      data_hash: dataHash,
    };

    return removeUndefinedProperties(json);
  }
}
