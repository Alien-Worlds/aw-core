import { Entity } from '../../../architecture/domain/entity';
import { ActionProperties, PermissionLevel } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';
import { removeUndefinedProperties } from '../../../utils';

/**
 * Action represents an action in a blockchain transaction.
 * It implements the Entity interface.
 *
 * @template DataType - The type of the data entity associated with the action.
 */
export class Action<DataType extends Entity = Entity> implements Entity {
  /**
   * Creates an instance of Action.
   *
   * @static
   * @template DataType - The type of the data entity associated with the action.
   * @param {ActionProperties<DataType>} properties - The model representing the action.
   * @returns {Action<DataType>} - The created instance of Action.
   */
  public static create<DataType extends Entity = Entity>(
    properties: ActionProperties<DataType>
  ): Action<DataType> {
    const { account, name, data, authorization } = properties;

    return new Action(account, name, authorization, data);
  }

  /**
   * Creates an instance of Action.
   *
   * @param {string} account - The account name associated with the action.
   * @param {string} name - The name of the action.
   * @param {PermissionLevel[]} authorization - The authorization levels required for the action.
   * @param {DataType} data - The data entity associated with the action.
   */
  constructor(
    public readonly account: string,
    public readonly name: string,
    public readonly authorization: PermissionLevel[],
    public readonly data: DataType
  ) {}
  public id: string;

  /**
   * Converts the action to a JSON object.
   *
   * @returns {UnknownObject} - The action as a JSON object.
   */
  public toJSON(): UnknownObject {
    const { id, account, name, authorization, data } = this;

    const json = {
      id,
      account,
      name,
      authorization,
      data: data.toJSON(),
    };

    return removeUndefinedProperties(json);
  }
}
