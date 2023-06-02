import { Where } from '../../where';

/**
 * Represents the parameters for updating.
 * @template EntityType - The type of the entities being updated.
 */
export class UpdateParams<EntityType = unknown> {
  /**
   * Creates a new instance of UpdateParams with the provided options.
   * @static
   * @param {EntityType[]} entities - The entities to update.
   * @param {Where} [where] - The where clause for updating.
   * @returns {UpdateParams} A new instance of UpdateParams.
   */
  public static create<EntityType = unknown>(
    entities: EntityType[],
    where?: Where
  ): UpdateParams {
    return new UpdateParams(entities, where);
  }

  /**
   * Constructs a new instance of UpdateParams.
   * @param {EntityType[]} entities - The entities to update.
   * @param {Where} [where] - The where clause for updating.
   */
  constructor(public readonly entities: EntityType[], public readonly where?: Where) {}
}
