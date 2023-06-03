import crypto from 'crypto';
import { serialize } from 'v8';
import { Entity } from '../../../architecture/domain/entity';
import { parseToBigInt, removeUndefinedProperties } from '../../../utils';
import { ContractDeltaProperties } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';

/**
 * Represents a contract delta.
 * @class
 * @implements {Entity}
 * @template DeltaType - The type of the data associated with the contract delta. Default is `Entity`.
 */
export class ContractDelta<DeltaType extends Entity = Entity> implements Entity {
  /**
   * Creates a new instance of `ContractDelta` based on the provided model.
   * @static
   * @param {ContractDeltaProperties<DeltaType>} properties - The model representing the contract delta.
   * @returns {ContractDelta<DeltaType>} A new instance of `ContractDelta`.
   */
  public static create<DeltaType extends Entity = Entity>(
    properties: ContractDeltaProperties,
    delta: DeltaType
  ): ContractDelta<DeltaType> {
    const {
      id,
      blockNumber,
      code,
      scope,
      table,
      payer,
      primaryKey,
      present,
      blockTimestamp,
    } = properties;

    const deltaBuffer = serialize(delta.toJSON());
    const deltaHash = crypto.createHash('sha1').update(deltaBuffer).digest('hex');

    return new ContractDelta(
      id,
      parseToBigInt(blockNumber),
      code,
      scope,
      table,
      deltaHash,
      delta,
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
   * @param {string} deltaHash - The hash of the data associated with the contract delta.
   * @param {DeltaType} delta - The data associated with the contract delta.
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
    public readonly deltaHash: string,
    public readonly delta: DeltaType,
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
      deltaHash: dataHash,
      delta: data,
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
      primaryKey: primaryKey.toString(),
      present,
      data: data.toJSON(),
      data_hash: dataHash,
    };

    return removeUndefinedProperties(json);
  }
}
