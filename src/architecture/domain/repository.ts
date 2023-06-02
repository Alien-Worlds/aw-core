/* eslint-disable @typescript-eslint/no-unused-vars */
import { CountParams } from './queries/params/count-params';
import { FindParams } from './queries/params/find-params';
import { QueryBuilder } from './queries/query-builder';
import { RemoveParams } from './queries/params/remove-params';
import { UpdateParams } from './queries/params/update-params';
import { Result } from './result';
import { RemoveStats, UpdateStats } from './types';

/**
 * Represents an abstract ReadOnlyRepository class.
 * @abstract
 * @class
 * @template EntityType - The type of the entity in the repository.
 */
export abstract class ReadOnlyRepository<EntityType = unknown> {
  /**
   * Retrieves the count of entities based on the provided parameters or query builder.
   * @abstract
   * @param {CountParams | QueryBuilder} paramsOrBuilder - The parameters or query builder for counting entities.
   * @returns {Promise<Result<number>>} A promise that resolves to the count of entities.
   */
  public abstract count(
    paramsOrBuilder?: CountParams | QueryBuilder
  ): Promise<Result<number>>;

  /**
   * Finds entities based on the provided parameters or query builder.
   * @abstract
   * @param {FindParams | QueryBuilder} paramsOrBuilder - The parameters or query builder for finding entities.
   * @returns {Promise<Result<EntityType[]>>} A promise that resolves to an array of found entities.
   */
  public abstract find(
    paramsOrBuilder?: FindParams | QueryBuilder
  ): Promise<Result<EntityType[]>>;
}

/**
 * Represents an abstract Repository class.
 * @abstract
 * @class
 * @template EntityType - The type of the entity in the repository.
 * @template DocumentType - The type of the document in the repository.
 */
export abstract class Repository<
  EntityType = unknown,
  DocumentType = unknown
> extends ReadOnlyRepository<EntityType> {
  /**
   * Updates entities based on the provided parameters or query builder.
   * @abstract
   * @param {UpdateParams | QueryBuilder} paramsOrBuilder - The parameters or query builder for updating entities.
   * @returns {Promise<Result<UpdateStats>>} A promise that resolves to the update statistics.
   */
  public abstract update(
    paramsOrBuilder: UpdateParams | QueryBuilder
  ): Promise<Result<UpdateStats>>;

  /**
   * Adds entities to the repository.
   * @abstract
   * @param {EntityType[]} entities - An array of entities to be added.
   * @returns {Promise<Result<EntityType[]>>} A promise that resolves to an array of added entities.
   */
  public abstract add(entities: EntityType[]): Promise<Result<EntityType[]>>;

  /**
   * Removes entities based on the provided parameters or query builder.
   * @abstract
   * @param {RemoveParams | QueryBuilder} paramsOrBuilder - The parameters or query builder for removing entities.
   * @returns {Promise<Result<RemoveStats>>} A promise that resolves to the remove statistics.
   */
  public abstract remove(
    paramsOrBuilder: RemoveParams | QueryBuilder
  ): Promise<Result<RemoveStats>>;
}
