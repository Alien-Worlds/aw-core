import { Where } from '../../where/where';

export enum UpdateMethod {
  UpdateOne,
  UpdateMany,
}

export type UpdateEachParams<T = unknown> = {
  update: T;
  where: Where;
  method?: UpdateMethod;
};

/**
 * Represents the parameters for performing an update operation.
 *
 * @template UpdateType The type of the entities or partial entities being updated.
 */
export class UpdateParams<UpdateType = unknown> {
  /**
   * Factory method for creating parameters to update multiple entities.
   *
   * @param {UpdateType} update The (partial) data to update.
   * @param {Where} where The where clause for the update.
   *
   * @returns {UpdateParams} An instance of UpdateParams.
   */
  public static createUpdateMany<UpdateType = unknown>(update: UpdateType, where: Where) {
    return new UpdateParams([update], [where], [UpdateMethod.UpdateMany]);
  }

  /**
   * Factory method for creating parameters to update each entity with a different set of parameters.
   *
   * @param {UpdateEachParams<UpdateType>[]} params - The array of parameters for each update.
   *
   * @returns {UpdateParams} An instance of UpdateParams.
   */
  public static createUpdateEach<UpdateType = unknown>(
    params: UpdateEachParams<UpdateType>[]
  ) {
    const updates = [];
    const wheres = [];
    const methods = [];

    params.forEach(({ update, where, method }) => {
      updates.push(update);
      wheres.push(where);
      methods.push(method || UpdateMethod.UpdateOne);
    });

    return new UpdateParams(updates, wheres, methods);
  }

  /**
   * Factory method for creating parameters to update a single entity.
   *
   * @param {UpdateType} update The (partial) data to update.
   * @param {Where} where The where clause for the update.
   *
   * @returns {UpdateParams} An instance of UpdateParams.
   */
  public static createUpdateOne<UpdateType = unknown>(update: UpdateType, where: Where) {
    return new UpdateParams([update], [where], [UpdateMethod.UpdateOne]);
  }

  /**
   * Constructs a new instance of UpdateParams.
   *
   * @param {UpdateType[]} updates The array of entities or partial entities to update.
   * @param {Where[]} where The array of where clauses corresponding to each update.
   * @param {UpdateMethod[]} methods The array of methods used for each update operation.
   */
  constructor(
    public readonly updates: UpdateType[],
    public readonly where: Where[],
    public readonly methods: UpdateMethod[]
  ) {}
}
