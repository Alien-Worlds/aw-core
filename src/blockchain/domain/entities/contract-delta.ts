import { Entity } from '../../../architecture/domain/entity';
import { removeUndefinedProperties } from '../../../utils';
import { UnknownObject } from '../../../architecture/domain/types';

/**
 * Represents a contract delta.
 * @class
 * @implements {Entity}
 * @template DeltaType - The type of the data associated with the contract delta. Default is `Entity`.
 */
export class ContractDelta<DeltaType extends Entity = Entity, RawDeltaType = UnknownObject>
  implements Entity<RawDeltaType>
{
  /**
   * Creates an instance of `ContractDelta`.
   *
   * @constructor
   * @param {string} id - The identifier of the contract delta.
   * @param {bigint} blockNumber - The block number of the contract delta.
   * @param {string} code - The code associated with the contract delta.
   * @param {string} scope - The scope of the contract delta.
   * @param {string} table - The table name of the contract delta.
   * @param {DeltaType} data - The data associated with the contract delta.
   * @param {string} payer - The account name of the payer.
   * @param {bigint} primaryKey - The primary key value of the contract delta.
   * @param {boolean} present - The present flag value of the contract delta.
   * @param {Date} blockTimestamp - The block timestamp of the contract delta.
   */
  constructor(
    public readonly id: string,
    public readonly blockNumber: bigint,
    public readonly code: string,
    public readonly scope: string,
    public readonly table: string,
    public readonly data: DeltaType,
    public readonly payer: string,
    public readonly primaryKey: bigint,
    public readonly present: boolean,
    public readonly blockTimestamp: Date
  ) {}

  /**
   * Serializes the `ContractDelta` instance to a JSON object.
   * @returns {RawDeltaType} The serialized JSON object representing the `ContractDelta`.
   */
  public toJSON(): RawDeltaType {
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
    } = this;

    const json = {
      id,
      block_timestamp: blockTimestamp.toISOString(),
      block_number: blockNumber.toString(),
      code,
      scope,
      table,
      payer,
      primary_key: primaryKey.toString(),
      present,
      data: data.toJSON(),
    };

    return removeUndefinedProperties<RawDeltaType>(json);
  }
}
