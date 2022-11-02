import { QueryModel, Result } from '../../../architecture';
import {
  MongoAggregateParams,
  MongoCountQueryParams,
  MongoDeleteQueryParams,
  MongoFindQueryParams,
  MongoUpdateQueryParams,
} from '../../data/mongo.types';
import { UpdateResult } from '../storage.enums';

/**
 * @abstract
 * @class
 */
export abstract class Repository<EntityType, DocumentType> {
  /**
   * @abstract
   * @param {EntityType} entity
   * @param {QueryModel<MongoUpdateQueryParams<DocumentType>>} model
   * @returns {Promise<Result<UpdateResult.Success | UpdateResult.Failure>}
   */
  public abstract update(
    entity: EntityType,
    model?: QueryModel<MongoUpdateQueryParams<DocumentType>>
  ): Promise<Result<UpdateResult.Success | UpdateResult.Failure>>;

  /**
   * @abstract
   * @param {EntityType[]} entities
   * @returns {Promise<Result<UpdateResult>}
   */
  public abstract updateMany(entities: EntityType[]): Promise<Result<UpdateResult>>;

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
   * @param {QueryModel<MongoFindQueryParams<DocumentType>>} model
   */
  public abstract count(
    model: QueryModel<MongoCountQueryParams<DocumentType>>
  ): Promise<Result<number>>;

  /**
   *
   * @abstract
   * @param {QueryModel<MongoFindQueryParams<DocumentType>>} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public abstract find(
    model: QueryModel<MongoFindQueryParams<DocumentType>>
  ): Promise<Result<EntityType[]>>;

  /**
   *
   * @abstract
   * @param {QueryModel<MongoFindQueryParams<DocumentType>>} model
   * @returns {Promise<Result<EntityType>>}
   */
  public abstract findOne(
    model: QueryModel<MongoFindQueryParams<DocumentType>>
  ): Promise<Result<EntityType>>;

  /**
   *
   * @abstract
   * @param {QueryModel<MongoAggregateParams>} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public abstract aggregate(
    model: QueryModel<MongoAggregateParams>
  ): Promise<Result<EntityType[]>>;

  /**
   *
   * @abstract
   * @param {QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType} data
   * @returns {Promise<Result<boolean>>}
   */
  public abstract remove(
    data: QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType
  ): Promise<Result<boolean>>;

  /**
   *
   * @abstract
   * @param {QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType[]} data
   * @returns {Promise<Result<boolean>>}
   */
  public abstract removeMany(
    data: QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType[]
  ): Promise<Result<boolean>>;
}
