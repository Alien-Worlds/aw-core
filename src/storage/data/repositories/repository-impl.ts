import { Failure } from '../../../architecture/domain/failure';
import { QueryModel } from '../../../architecture/domain/query-model';
import { Result } from '../../../architecture/domain/result';
import { isQueryModel } from '../../../utils';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { CollectionMongoSource } from '../data-sources/collection.mongo.source';
import { Mapper } from '../mappers/mapper';
import {
  MongoAggregateParams,
  MongoDeleteQueryParams,
  MongoFindQueryParams,
} from '../mongo.types';

type ObjectWithStringId = {
  _id: string;
};

/**
 * @class
 */
export class RepositoryImpl<EntityType, DocumentType> {
  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(
    protected mongoSource: CollectionMongoSource<DocumentType>,
    protected mapper: Mapper<EntityType, DocumentType>
  ) {}

  /**
   *
   * @async
   * @returns {Promise<Result<EntityType>}
   */
  public async add(entity: EntityType): Promise<Result<EntityType>> {
    try {
      const dto = this.mapper.createDocumentFromEntity(entity);
      const id = await this.mongoSource.insert(dto);
      (dto as ObjectWithStringId)._id = id;
      return Result.withContent(this.mapper.createEntityFromDocument(dto));
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel<MongoFindQueryParams<DocumentType>>} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async find(
    model: QueryModel<MongoFindQueryParams<DocumentType>>
  ): Promise<Result<EntityType[]>> {
    try {
      const { filter, options } = model.toQueryParams();
      const dtos = await this.mongoSource.find(filter, options);

      return dtos && dtos.length > 0
        ? Result.withContent(
            dtos.map(dto => this.mapper.createEntityFromDocument(dto ))
          )
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.mongoSource.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel<MongoFindQueryParams<DocumentType>>} model
   * @returns {Promise<Result<EntityType>>}
   */
  public async findOne(
    model: QueryModel<MongoFindQueryParams<DocumentType>>
  ): Promise<Result<EntityType>> {
    try {
      const { filter, options } = model.toQueryParams();
      const dto = await this.mongoSource.findOne(filter, options);

      return dto
        ? Result.withContent(this.mapper.createEntityFromDocument(dto as DocumentType))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.mongoSource.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel<MongoAggregateParams>} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async aggregate(
    model: QueryModel<MongoAggregateParams>
  ): Promise<Result<EntityType[]>> {
    try {
      const { pipeline, options } = model.toQueryParams();
      options.allowDiskUse = true;

      const dtos = await this.mongoSource.aggregate(pipeline, options);

      return dtos && dtos.length > 0
        ? Result.withContent(
            dtos.map(dto => this.mapper.createEntityFromDocument(dto ))
          )
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.mongoSource.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType} data
   * @returns {Promise<Result<boolean>>}
   */
  public async remove(
    data: QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType
  ): Promise<Result<boolean>> {
    try {
      let removed = false;

      if (isQueryModel(data)) {
        const { filter, options } = data.toQueryParams();
        removed = await this.mongoSource.remove(filter, options);
      } else {
        removed = await this.mongoSource.remove(data);
      }

      return Result.withContent(removed);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType[]} data
   * @returns {Promise<Result<boolean>>}
   */
  public async removeMany(
    data: QueryModel<MongoDeleteQueryParams<DocumentType>> | DocumentType[]
  ): Promise<Result<boolean>> {
    try {
      let removed = false;
      if (Array.isArray(data)) {
        removed = await this.mongoSource.removeMany(data);
      } else {
        const { filter, options } = data.toQueryParams();
        removed = await this.mongoSource.removeMany(filter, options);
      }

      return Result.withContent(removed);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
