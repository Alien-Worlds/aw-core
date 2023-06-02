import crypto from 'crypto';
import { serialize } from 'v8';

import { Entity } from '../../../architecture/domain/entity';
import { ContractActionModel } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';
import { removeUndefinedProperties } from '../../../utils';
import { Action } from './action';

/**
 * Represents a contract action in the blockchain.
 * @class
 * @implements {Entity}
 * @template ActionDataEntityType - The type of data entity associated with the action.
 */
export class ContractAction<ActionDataEntityType extends Entity = Entity> implements Entity {
  /**
   * Creates an instance of `ContractAction` using the provided model.
   * @static
   * @param {ContractActionModel} model - The model representing the contract action.
   * @returns {ContractAction<ActionDataEntityType>} The created contract action instance.
   */
  public static create<ActionDataEntityType extends Entity = Entity>(
    model: ContractActionModel<ActionDataEntityType>
  ): ContractAction<ActionDataEntityType> {
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
    const action = Action.create<ActionDataEntityType>({
      name,
      account,
      data,
    });
    const actionBuffer = serialize({ name, account, data });
    const actionHash = crypto.createHash('sha1').update(actionBuffer).digest('hex');

    return new ContractAction<ActionDataEntityType>(
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
   * Creates an instance of `ContractAction`.
   * 
   * @constructor
   * @param {string} id - The ID of the contract action.
   * @param {Date} blockTimestamp - The timestamp of the block containing the contract action.
   * @param {bigint} blockNumber - The number of the block containing the contract action.
   * @param {bigint} globalSequence - The global sequence of the contract action.
   * @param {bigint} receiverSequence - The receiver sequence of the contract action.
   * @param {string} transactionId - The ID of the transaction containing the contract action.
   * @param {Action<ActionDataEntityType>} action - The action associated with the contract action.
   * @param {string} actionHash - The hash value of the serialized action.
   */
  constructor(
    public readonly id: string,
    public readonly blockTimestamp: Date,
    public readonly blockNumber: bigint,
    public readonly globalSequence: bigint,
    public readonly receiverSequence: bigint,
    public readonly transactionId: string,
    public readonly action: Action<ActionDataEntityType>,
    public readonly actionHash: string
  ) {}

  /**
   * Converts the `ContractAction` to a JSON object.
   * @method
   * @returns {UnknownObject} The JSON representation of the `ContractAction`.
   */
  public toJSON(): UnknownObject {
    const {
      id,
      blockTimestamp,
      blockNumber,
      globalSequence,
      receiverSequence,
      transactionId,
      action,
      actionHash,
    } = this;

    const json = {
      id,
      block_timestamp: blockTimestamp.toISOString(),
      block_number: blockNumber.toString(),
      global_sequence: globalSequence.toString(),
      receiver_sequence: receiverSequence.toString(),
      transaction_id: transactionId,
      action: action.toJSON(),
      action_hash: actionHash,
    };

    return removeUndefinedProperties(json);
  }
}
