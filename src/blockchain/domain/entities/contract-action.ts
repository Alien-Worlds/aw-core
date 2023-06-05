import crypto from 'crypto';
import { serialize } from 'v8';

import { Entity } from '../../../architecture/domain/entity';
import { ContractActionModel } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';
import { removeUndefinedProperties } from '../../../utils';

/**
 * Represents a contract action in the blockchain.
 * @class
 * @implements {Entity}
 * @template ActionDataType - The type of data entity associated with the action.
 */
export class ContractAction<
  ActionDataType extends Entity = Entity,
  ActionJsonType = UnknownObject
> implements Entity<ActionJsonType>
{
  /**
   * Creates an instance of `ContractAction` using the provided model.
   * @static
   * @param {ContractActionModel} model - The model representing the contract action.
   * @param {ActionDataType} data - The entity of the contract action data.
   * @returns {ContractAction<ActionDataType, ActionJsonType>} The created contract action instance.
   */
  public static create<
    ActionDataType extends Entity = Entity,
    ActionJsonType = UnknownObject
  >(
    model: ContractActionModel,
    data: ActionDataType
  ): ContractAction<ActionDataType, ActionJsonType> {
    const {
      id,
      blockTimestamp,
      blockNumber,
      globalSequence,
      receiverSequence,
      transactionId,
      account,
      name,
    } = model;
    const actionBuffer = serialize({ name, account, data: data.toJSON() });
    const actionHash = crypto.createHash('sha1').update(actionBuffer).digest('hex');

    return new ContractAction<ActionDataType, ActionJsonType>(
      id,
      blockTimestamp,
      blockNumber,
      account,
      name,
      globalSequence,
      receiverSequence,
      transactionId,
      data,
      actionHash
    );
  }

  /**
   * Creates an instance of `ContractAction`.
   *
   * @constructor
   * @param {string} id - The ID of the contract action.
   * @param {Date} blockTimestamp - The timestamp of the block containing the contract action.
   * @param {bigint} blockNumber - The number of the block containing the contract action.
   * @param {string} account - The account name associated with the action.
   * @param {string} name - The name of the action.
   * @param {bigint} globalSequence - The global sequence of the contract action.
   * @param {bigint} receiverSequence - The receiver sequence of the contract action.
   * @param {string} transactionId - The ID of the transaction containing the contract action.
   * @param {ActionDataType} data - The data entity associated with the action data.
   * @param {string} actionHash - The hash value of the serialized action.
   */
  constructor(
    public readonly id: string,
    public readonly blockTimestamp: Date,
    public readonly blockNumber: bigint,
    public readonly account: string,
    public readonly name: string,
    public readonly globalSequence: bigint,
    public readonly receiverSequence: bigint,
    public readonly transactionId: string,
    public readonly data: ActionDataType,
    public readonly actionHash: string
  ) {}

  /**
   * Converts the `ContractAction` to a JSON object.
   * @method
   * @returns {ActionJsonType} The JSON representation of the `ContractAction`.
   */
  public toJSON(): ActionJsonType {
    const {
      id,
      blockTimestamp,
      blockNumber,
      globalSequence,
      receiverSequence,
      transactionId,
      account,
      name,
      data,
      actionHash,
    } = this;

    const json = {
      id,
      block_timestamp: blockTimestamp.toISOString(),
      block_number: blockNumber.toString(),
      global_sequence: globalSequence.toString(),
      receiver_sequence: receiverSequence.toString(),
      transaction_id: transactionId,
      account,
      name,
      data: data.toJSON(),
      action_hash: actionHash,
    };

    return removeUndefinedProperties<ActionJsonType>(json);
  }
}
