import { Where } from '../../where';

export enum UpdateMethod {
  UpdateEach,
  UpdateMany,
}

export type UpdateEachParams<T = unknown> = { update: T; where?: Where };

/**
 * Represents the parameters for updating.
 * @template UpdateType - The type of the entities/partial being updated.
 */
export class UpdateParams<UpdateType = unknown> {

  public static createUpdateManyParams<UpdateType = unknown>(
    updates: UpdateType[],
    where: Where
  ) {
    return new UpdateParams(updates, [where], UpdateMethod.UpdateMany);
  }

  public static createUpdateEachParams<UpdateType = unknown>(
    params: UpdateEachParams<UpdateType>[]
  ) {
    const updates = [];
    const wheres = [];

    params.forEach(({ update, where }) => {
      updates.push(update);
      wheres.push(where);
    });

    return new UpdateParams(updates, wheres, UpdateMethod.UpdateEach);
  }

  /**
   * Constructs a new instance of UpdateParams.
   * @param {UpdateType[]} updates - The entities/partial to update.
   * @param {Where} [where] - The where clause for updating.
   */
  constructor(
    public readonly updates: UpdateType[],
    public readonly where: Where[],
    public readonly method: UpdateMethod
  ) {}
}
