import { UpdateStatus } from '../data/collection.types';
import { QueryModel } from './query-model';
import { Result } from './result';

/**
 * @abstract
 * @class
 */
export abstract class Repository<EntityType, DocumentType> {
  /**
   * @abstract
   * @param {EntityType} entity
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>}
   */
  public abstract update(
    entity: EntityType,
    model?: QueryModel | DocumentType
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>>;

  /**
   * @abstract
   * @param {EntityType[]} entities
   * @returns {Promise<Result<UpdateStatus>}
   */
  public abstract updateMany(entities: EntityType[]): Promise<Result<UpdateStatus>>;

  /**
   * @abstract
   * @param {EntityType} entity
   * @returns {Promise<Result<EntityType>}
   */
  public abstract add(entity: EntityType): Promise<Result<EntityType>>;

  /**
   * @abstract
   * @param {EntityType} entity
   * @returns {Promise<Result<EntityType>}
   */
  public abstract addOnce(entity: EntityType): Promise<Result<EntityType>>;

  /**
   * @abstract
   * @param {QueryModel | DocumentType} model
   */
  public abstract count(model: QueryModel | DocumentType): Promise<Result<number>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public abstract find(model: QueryModel | DocumentType): Promise<Result<EntityType[]>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType>>}
   */
  public abstract findOne(model: QueryModel | DocumentType): Promise<Result<EntityType>>;

  /**
   *
   * @abstract
   * @param {QueryModel} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public abstract aggregate(model: QueryModel): Promise<Result<EntityType[]>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType} data
   * @returns {Promise<Result<boolean>>}
   */
  public abstract remove(data: QueryModel | DocumentType): Promise<Result<boolean>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType[]} data
   * @returns {Promise<Result<boolean>>}
   */
  public abstract removeMany(data: QueryModel | DocumentType[]): Promise<Result<boolean>>;
}

/**
 *
 */
export abstract class ReadOnlyRepository<EntityType, DocumentType> {
  /**
   * @abstract
   * @param {QueryModel | DocumentType} model
   */
  public abstract count(model: QueryModel | DocumentType): Promise<Result<number>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public abstract find(model: QueryModel | DocumentType): Promise<Result<EntityType[]>>;

  /**
   *
   * @abstract
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType>>}
   */
  public abstract findOne(model: QueryModel | DocumentType): Promise<Result<EntityType>>;
}
