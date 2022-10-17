import { QueryModel } from '../../../architecture/domain/query-model';
import { Result } from '../../../architecture/domain/result';
import {
  MongoAggregateParams,
  MongoDeleteQueryParams,
  MongoFindQueryParams,
} from '../../data/mongo.types';

/**
 * @abstract
 * @class
 */
export abstract class Repository<EntityType, DocumentType> {
  /**
   * @abstract
   * @param {EntityType} entity
   * @returns {Promise<Result<EntityType>}
   */
  public abstract add(entity: EntityType): Promise<Result<EntityType>>;

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
