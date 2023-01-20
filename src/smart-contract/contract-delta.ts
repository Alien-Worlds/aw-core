import { Long, ObjectId } from 'mongodb';
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
  dataHash: string;
};

export abstract class ContractDeltaData<DocumentType> {
  public abstract toDocument(): DocumentType;
}

/**
 * Represents schema smart contract data
 *
 * @class
 */
export class ContractDelta<
  DataType extends ContractDeltaData<DataDocumentType>,
  DataDocumentType = object
> {
  /**
   * Get Schema smart contract data based on table row.
   *
   * @static
   * @param {ContractDeltaDocument} dto
   * @returns {VoteSmartContractData}
   */
  public static fromDocument<
    DataType extends ContractDeltaData<DataDocumentType>,
    DataDocumentType = object
  >(
    dto: ContractDeltaDocument<DataDocumentType>,
    dataMapper: (data: DataDocumentType) => DataType
  ): ContractDelta<DataType, DataDocumentType> {
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

    return new ContractDelta<DataType, DataDocumentType>(
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

  /**
   * @static
   * @param {string} id
   * @param {string|bigint} block_num
   * @param {string} code
   * @param {string} scope
   * @param {string} table
   * @param {string} payer
   * @param {string|bigint} primary_key
   * @param {number} present
   * @param {Date} block_timestamp
   * @param {DataType} data
   * @param {string} dataHash
   * @returns
   */
  public static create<
    DataType extends ContractDeltaData<DataDocumentType>,
    DataDocumentType = object
  >(model: ContractDeltaModel<DataType>): ContractDelta<DataType, DataDocumentType> {
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
    } = model;
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
    public readonly data: DataType,
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
      data: data.toDocument(),
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
