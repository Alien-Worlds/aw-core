import crypto from 'crypto';
import { Long, ObjectId } from 'mongodb';
import { serialize } from 'v8';
import { Entity } from '../architecture/domain/entity';
import { parseToBigInt, removeUndefinedProperties } from '../utils';

/**
 *
 * @type
 */
export type ContractDeltaDocument<DataType = object> = {
  _id?: ObjectId;
  block_num?: Long;
  code?: string;
  scope?: string;
  table?: string;
  data_hash?: string;
  data?: DataType;
  payer?: string;
  primary_key?: Long;
  present?: number;
  block_timestamp?: Date;
};

/**
 *
 * @type
 */
export type ContractDeltaModel<DataType = object> = {
  id: string;
  blockNumber: string | bigint;
  code: string;
  scope: string;
  table: string;
  payer: string;
  primaryKey: string | bigint;
  present: number;
  blockTimestamp: Date;
  data: DataType;
  dataHash?: string;
};

/**
 * Represents schema smart contract data
 *
 * @class
 */
export class ContractDelta<DataEntityType extends Entity, DataDocumentType = object> {
  /**
   * Get Schema smart contract data based on table row.
   *
   * @static
   * @param {ContractDeltaDocument} dto
   * @returns {VoteSmartContractData}
   */
  public static fromDocument<DataEntityType extends Entity, DataDocumentType = object>(
    dto: ContractDeltaDocument<DataDocumentType>,
    dataMapper: (data: DataDocumentType) => DataEntityType
  ): ContractDelta<DataEntityType, DataDocumentType> {
    const {
      _id,
      block_num,
      code,
      scope,
      table,
      data_hash,
      data,
      payer,
      primary_key,
      present,
      block_timestamp,
    } = dto;

    return new ContractDelta<DataEntityType, DataDocumentType>(
      _id instanceof ObjectId ? _id.toString() : _id,
      parseToBigInt(block_num),
      code,
      scope,
      table,
      data_hash,
      dataMapper(data),
      payer,
      parseToBigInt(primary_key),
      present,
      block_timestamp
    );
  }

  public static create<DataEntityType extends Entity, DataDocumentType = object>(
    model: ContractDeltaModel<DataEntityType>
  ): ContractDelta<DataEntityType, DataDocumentType> {
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
   * @private
   * @constructor
   */
  private constructor(
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
   * @returns {ContractDeltaDocument}
   */
  public toDocument(): ContractDeltaDocument<DataDocumentType> {
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

    const document: ContractDeltaDocument<DataDocumentType> = {
      block_num: Long.fromBigInt(blockNumber),
      code,
      scope,
      table,
      data_hash: dataHash,
      data: (<Entity<DataDocumentType>>data).toDocument(),
      payer,
      primary_key: Long.fromBigInt(primaryKey),
      present,
      block_timestamp: blockTimestamp,
    };

    if (id) {
      document._id = new ObjectId(id);
    }

    return removeUndefinedProperties<ContractDeltaDocument<DataDocumentType>>(document);
  }
}
