import { Long, ObjectId } from 'mongodb';
import { parseToBigInt, removeUndefinedProperties } from '../utils';

export type Authorization = {
  actor: string;
  permission: string;
};
/** Action with data in structured form */
export type ActionDocument<DataDocumentType = object> = {
  account: string;
  name: string;
  authorization: Authorization[];
  data: DataDocumentType;
};

/**
 *
 * @type
 */
export type ContractActionDocument<DataType = object> = {
  _id?: ObjectId;
  block_num?: Long;
  block_timestamp?: Date;
  global_sequence?: Long;
  recv_sequence?: Long;
  trx_id?: string;
  action?: ActionDocument<DataType>;
  [key: string]: unknown;
};

export abstract class ContractActionData<DocumentType> {
  public abstract toDocument(): DocumentType;
}

export class Action<
  DataType extends ContractActionData<DataDocumentType>,
  DataDocumentType = object
> {
  /**
   *
   * @static
   * @returns {Action}
   */
  public static fromDocument<
    DataType extends ContractActionData<DataDocumentType>,
    DataDocumentType = object
  >(
    dto: ActionDocument<DataDocumentType>,
    dataMapper: (data: DataDocumentType) => DataType
  ): Action<DataType, DataDocumentType> {
    const { account, name, authorization, data } = dto;

    return new Action(account, name, authorization, dataMapper(data));
  }

  /**
   * @private
   * @constructor
   */
  private constructor(
    public readonly account: string,
    public readonly name: string,
    public readonly authorization: Authorization[],
    public readonly data: DataType
  ) {}

  public toDocument(): ActionDocument<DataDocumentType> {
    const { account, name, authorization, data } = this;

    return {
      account,
      name,
      authorization,
      data: data.toDocument(),
    };
  }
}

/**
 * Represents schema smart contract data
 *
 * @class
 */
export class ContractAction<
  ActionDataType extends ContractActionData<ActionDataDocumentType>,
  ActionDataDocumentType = object
> {
  /**
   *
   * @static
   * @returns {Action}
   */
  public static fromDocument<
    ActionDataType extends ContractActionData<ActionDataDocumentType>,
    ActionDataDocumentType = object
  >(
    dto: ContractActionDocument<ActionDataDocumentType>,
    dataMapper: (data: ActionDataDocumentType) => ActionDataType
  ): ContractAction<ActionDataType, ActionDataDocumentType> {
    const {
      _id,
      block_num,
      recv_sequence,
      global_sequence,
      trx_id,
      action,
      block_timestamp,
    } = dto;

    return new ContractAction<ActionDataType, ActionDataDocumentType>(
      _id instanceof ObjectId ? _id.toString() : _id,
      block_timestamp,
      block_num ? parseToBigInt(block_num) : null,
      global_sequence ? parseToBigInt(global_sequence) : null,
      recv_sequence ? parseToBigInt(recv_sequence) : null,
      trx_id,
      Action.fromDocument(action, dataMapper)
    );
  }

  /**
   * @private
   * @constructor
   */
  private constructor(
    public readonly id: string,
    public readonly blockTimestamp: Date,
    public readonly blockNumber: bigint,
    public readonly globalSequence: bigint,
    public readonly receiverSequence: bigint,
    public readonly transactionId: string,
    public readonly action: Action<ActionDataType, ActionDataDocumentType>
  ) {}

  /**
   * @returns {ActionDocument}
   */
  public toDocument(): ActionDocument<ActionDataDocumentType> {
    const {
      id,
      blockNumber,
      transactionId,
      blockTimestamp,
      globalSequence,
      receiverSequence,
      action,
    } = this;

    const document = {
      _id: new ObjectId(id),
      block_num: Long.fromBigInt(blockNumber),
      recv_sequence: Long.fromBigInt(receiverSequence),
      global_sequence: Long.fromBigInt(globalSequence),
      trx_id: transactionId,
      action: action.toDocument(),
      block_timestamp: blockTimestamp,
    };

    return removeUndefinedProperties<ActionDocument<ActionDataDocumentType>>(document);
  }
}
