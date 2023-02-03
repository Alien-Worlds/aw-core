import crypto from 'crypto';
import { serialize } from 'v8';
import { Long, ObjectId } from 'mongodb';
import { parseToBigInt, removeUndefinedProperties } from '../utils';
import { Entity } from '../architecture/domain/entity';

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

export type ActionModel<DataType = unknown> = {
  account: string;
  name: string;
  data: DataType;
};

export type ContractActionModel<DataType = unknown> = {
  account: string;
  name: string;
  blockTimestamp: Date;
  blockNumber: bigint;
  globalSequence: bigint;
  receiverSequence: bigint;
  transactionId: string;
  data: DataType;
  actionHash?: string;
  id?: string;
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
  action_hash?: string;
  [key: string]: unknown;
};

export class Action<DataEntityType extends Entity = Entity, DataDocumentType = object> {
  /**
   *
   * @static
   * @returns {Action}
   */
  public static create<DataEntityType extends Entity = Entity, DataDocumentType = object>(
    model: ActionModel<DataEntityType>
  ): Action<DataEntityType, DataDocumentType> {
    const { account, name, data } = model;

    return new Action(account, name, null, data);
  }
  /**
   *
   * @static
   * @returns {Action}
   */
  public static fromDocument<
    DataEntityType extends Entity = Entity,
    DataDocumentType = object
  >(
    dto: ActionDocument<DataDocumentType>,
    dataMapper: (data: DataDocumentType) => DataEntityType
  ): Action<DataEntityType, DataDocumentType> {
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
    public readonly data: DataEntityType
  ) {}

  public toDocument(): ActionDocument<DataDocumentType> {
    const { account, name, authorization, data } = this;

    return {
      account,
      name,
      authorization,
      data: (<Entity<DataDocumentType>>data).toDocument(),
    };
  }
}

/**
 * Represents schema smart contract data
 *
 * @class
 */
export class ContractAction<
  ActionDataEntityType extends Entity = Entity,
  ActionDataDocumentType = object
> {
  /**
   *
   * @static
   * @returns {ContractAction}
   */
  public static create<
    ActionDataEntityType extends Entity = Entity,
    ActionDataDocumentType = object
  >(
    model: ContractActionModel<ActionDataEntityType>
  ): ContractAction<ActionDataEntityType, ActionDataDocumentType> {
    const {
      id,
      blockTimestamp,
      blockNumber,
      globalSequence,
      receiverSequence,
      transactionId,
      data,
      name,
      account,
    } = model;
    const action = Action.create<ActionDataEntityType, ActionDataDocumentType>({
      name,
      account,
      data,
    });
    const actionBuffer = serialize({ name, account, data });
    const actionHash = crypto.createHash('sha1').update(actionBuffer).digest('hex');

    return new ContractAction<ActionDataEntityType, ActionDataDocumentType>(
      id,
      blockTimestamp,
      blockNumber,
      globalSequence,
      receiverSequence,
      transactionId,
      action,
      actionHash
    );
  }
  /**
   *
   * @static
   * @returns {ContractAction}
   */
  public static fromDocument<
    ActionDataEntityType extends Entity = Entity,
    ActionDataDocumentType = object
  >(
    dto: ContractActionDocument<ActionDataDocumentType>,
    dataMapper: (data: ActionDataDocumentType) => ActionDataEntityType
  ): ContractAction<ActionDataEntityType, ActionDataDocumentType> {
    const {
      _id,
      block_num,
      recv_sequence,
      global_sequence,
      trx_id,
      action,
      action_hash,
      block_timestamp,
    } = dto;

    return new ContractAction<ActionDataEntityType, ActionDataDocumentType>(
      _id instanceof ObjectId ? _id.toString() : _id,
      block_timestamp,
      block_num ? parseToBigInt(block_num) : null,
      global_sequence ? parseToBigInt(global_sequence) : null,
      recv_sequence ? parseToBigInt(recv_sequence) : null,
      trx_id,
      Action.fromDocument(action, dataMapper),
      action_hash
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
    public readonly action: Action<ActionDataEntityType, ActionDataDocumentType>,
    public readonly actionHash: string
  ) {}

  /**
   * @returns {ContractActionDocument<ActionDataDocumentType>}
   */
  public toDocument(): ContractActionDocument<ActionDataDocumentType> {
    const {
      id,
      blockNumber,
      transactionId,
      blockTimestamp,
      globalSequence,
      receiverSequence,
      action,
      actionHash,
    } = this;

    const document: ContractActionDocument<ActionDataDocumentType> = {
      block_num: Long.fromBigInt(blockNumber),
      recv_sequence: Long.fromBigInt(receiverSequence),
      global_sequence: Long.fromBigInt(globalSequence),
      trx_id: transactionId,
      action: action.toDocument(),
      block_timestamp: blockTimestamp,
      action_hash: actionHash,
    };

    if (id) {
      document._id = new ObjectId(id);
    }

    return removeUndefinedProperties<ContractActionDocument<ActionDataDocumentType>>(
      document
    );
  }
}
