import { Long, ObjectId } from 'mongodb';
import { parseToBigInt, removeUndefinedProperties } from '../utils';

/**
 *
 * @type
 */
export type ContractTableRowDocument<DataType = object> = {
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

export abstract class ContractTableRowData<DocumentType> {
  public abstract toDocument(): DocumentType;
}

/**
 * Represents schema smart contract data
 *
 * @class
 */
export class ContractTableRow<
  DataType extends ContractTableRowData<DataDocumentType>,
  DataDocumentType = object
> {
  /**
   * Get Schema smart contract data based on table row.
   *
   * @static
   * @param {ContractTableRowDocument} dto
   * @returns {VoteSmartContractData}
   */
  public static fromDocument<
    DataType extends ContractTableRowData<DataDocumentType>,
    DataDocumentType = object
  >(
    dto: ContractTableRowDocument<DataDocumentType>,
    dataMapper: (data: DataDocumentType) => DataType
  ): ContractTableRow<DataType, DataDocumentType> {
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

    return new ContractTableRow<DataType, DataDocumentType>(
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
    DataType extends ContractTableRowData<DataDocumentType>,
    DataDocumentType = object
  >(
    id: string,
    blockNumber: string | bigint,
    code: string,
    scope: string,
    table: string,
    payer: string,
    primaryKey: string | bigint,
    present: number,
    blockTimestamp: Date,
    data: DataType,
    dataHash: string
  ): ContractTableRow<DataType, DataDocumentType> {
    return new ContractTableRow(
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
   * @returns {ContractTableRowDocument}
   */
  public toDocument(): ContractTableRowDocument<DataDocumentType> {
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

    const document = {
      _id: new ObjectId(id),
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

    return removeUndefinedProperties<ContractTableRowDocument<DataDocumentType>>(
      document
    );
  }
}
