import { Failure } from '../../../architecture/domain/failure';
import { QueryModel } from '../../../architecture/domain/query-model';
import { Result } from '../../../architecture/domain/result';
import { isQueryModel } from '../../../utils';
import { EntityAlreadyExistsError } from '../../domain/errors/entity-already-exists.error';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { InsertOnceError } from '../../domain/errors/insert-once.error';
import { Repository } from '../../domain/repositories/repository';
import { UpdateResult } from '../../domain/storage.enums';
import { CollectionMongoSource } from '../data-sources/collection.mongo.source';
import { Mapper } from '../mappers/mapper';
import {
  MongoAggregateParams,
  MongoCountQueryParams,
  MongoDeleteQueryParams,
  MongoFindQueryParams,
  MongoUpdateQueryParams,
} from '../mongo.types';

type ObjectWithStringId = {
  _id: string;
};

/**
 * @class
 */
export class RepositoryImpl<EntityType, DocumentType>
  implements Repository<EntityType, DocumentType>
{
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
   * @param {EntityType} entity
   * @param {QueryModel<MongoUpdateQueryParams<DocumentType>>} model
   * @returns {Promise<Result<UpdateResult.Success | UpdateResult.Failure, Error>>}
   */
  public async update(
    entity: EntityType,
    model?: QueryModel<MongoUpdateQueryParams<DocumentType>>
  ): Promise<Result<UpdateResult.Success | UpdateResult.Failure>> {
    try {
      const data = this.mapper.createDocumentFromEntity(entity);

      let filter = {};
      let options = {};

      if (model) {
        const params = model.toQueryParams();
        filter = params.filter;
        options = params.options;
      }

      const { acknowledged, modifiedCount, upsertedCount } =
        await this.mongoSource.update(data, filter, options);

      return acknowledged && (modifiedCount || upsertedCount)
        ? Result.withContent(UpdateResult.Success)
        : Result.withContent(UpdateResult.Failure);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
  /**
   *
   * @param {EntityType[]} entities
   * @returns {Promise<Result<UpdateResult>>}
   */
  public async updateMany(entities: EntityType[]): Promise<Result<UpdateResult>> {
    try {
      const documents = entities.map(entity =>
        this.mapper.createDocumentFromEntity(entity)
      );
      const { modifiedCount, upsertedCount } = await this.mongoSource.updateMany(
        documents
      );

      const operationsCount = modifiedCount + upsertedCount;

      return operationsCount === documents.length
        ? Result.withContent(UpdateResult.Success)
        : operationsCount > 0 && operationsCount < documents.length
        ? Result.withContent(UpdateResult.Partial)
        : Result.withContent(UpdateResult.Failure);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * @async
   * @param {QueryModel<MongoCountQueryParams<DocumentType>>} model
   * @returns {number}
   */
  public async count(
    model: QueryModel<MongoCountQueryParams<DocumentType>>
  ): Promise<Result<number>> {
    try {
      const count = await this.mongoSource.count(model.toQueryParams());

      return Result.withContent(count);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

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
   * @async
   * @param {EntityType} entity
   */
  public async addOnce(entity: EntityType): Promise<Result<EntityType>> {
    try {
      const dto = this.mapper.createDocumentFromEntity(entity);
      const result = await this.mongoSource.update(
        dto,
        {
          $setOnInsert: dto,
        },
        { upsert: true }
      );

      if (result.upsertedId) {
        (dto as ObjectWithStringId)._id = result.upsertedId.toString();
        return Result.withContent(this.mapper.createEntityFromDocument(dto));
      }

      if (result.matchedCount > 0) {
        return Result.withFailure(Failure.fromError(new EntityAlreadyExistsError()));
      }

      return Result.withFailure(Failure.fromError(new InsertOnceError()));
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
        ? Result.withContent(dtos.map(dto => this.mapper.createEntityFromDocument(dto)))
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
        ? Result.withContent(dtos.map(dto => this.mapper.createEntityFromDocument(dto)))
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
