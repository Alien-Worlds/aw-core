import { Entity } from '../../../architecture/domain/entity';
import { ActionModel, PermissionLevel } from '../types';
import { UnknownObject } from '../../../architecture/domain/types';
import { removeUndefinedProperties } from '../../../utils';

/**
 * Action represents an action in a blockchain transaction.
 * It implements the Entity interface.
 *
 * @template DataEntityType - The type of the data entity associated with the action.
 */
export class Action<DataEntityType extends Entity = Entity> implements Entity {
  /**
   * Creates an instance of Action.
   *
   * @static
   * @template DataEntityType - The type of the data entity associated with the action.
   * @param {ActionModel<DataEntityType>} model - The model representing the action.
   * @returns {Action<DataEntityType>} - The created instance of Action.
   */
  public static create<DataEntityType extends Entity = Entity>(
    model: ActionModel<DataEntityType>
  ): Action<DataEntityType> {
    const { account, name, data } = model;

    return new Action(account, name, null, data);
  }

  /**
   * Creates an instance of Action.
   *
   * @param {string} account - The account name associated with the action.
   * @param {string} name - The name of the action.
   * @param {PermissionLevel[]} authorization - The authorization levels required for the action.
   * @param {DataEntityType} data - The data entity associated with the action.
   */
  constructor(
    public readonly account: string,
    public readonly name: string,
    public readonly authorization: PermissionLevel[],
    public readonly data: DataEntityType
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
