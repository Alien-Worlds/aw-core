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
export class RepositoryImpl<DefaultEntityType, DefaultDocumentType>
  implements Repository<DefaultEntityType, DefaultDocumentType>
{
  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(
    protected mongoSource: CollectionMongoSource<DefaultDocumentType>,
    protected mapper: Mapper<DefaultEntityType, DefaultDocumentType>
  ) {}

  /**
   *
   * @param {DefaultEntityType} entity
   * @param {QueryModel<MongoUpdateQueryParams<DefaultDocumentType>>} model
   * @returns {Promise<Result<UpdateResult.Success | UpdateResult.Failure, Error>>}
   */
  public async update(
    entity: DefaultEntityType,
    model?: QueryModel<MongoUpdateQueryParams<DefaultDocumentType>>
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
   * @param {DefaultEntityType[]} entities
   * @returns {Promise<Result<UpdateResult>>}
   */
  public async updateMany(entities: DefaultEntityType[]): Promise<Result<UpdateResult>> {
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
   * @param {QueryModel<MongoCountQueryParams<DefaultDocumentType>>} model
   * @returns {number}
   */
  public async count(
    model: QueryModel<MongoCountQueryParams<DefaultDocumentType>>
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
   * @returns {Promise<Result<DefaultEntityType>}
   */
  public async add(entity: DefaultEntityType): Promise<Result<DefaultEntityType>> {
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
   * @param {DefaultEntityType} entity
   */
  public async addOnce(entity: DefaultEntityType): Promise<Result<DefaultEntityType>> {
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
   * @param {QueryModel<MongoFindQueryParams<DefaultDocumentType>>} model
   * @returns {Promise<Result<DefaultEntityType[]>>}
   */
  public async find<DocumentType = DefaultDocumentType, EntityType = DefaultEntityType>(
    model: QueryModel<MongoFindQueryParams<DefaultDocumentType>>
  ): Promise<Result<EntityType[]>> {
    try {
      const { filter, options } = model.toQueryParams();
      const dtos = await this.mongoSource.find<DocumentType>(filter, options);

      return dtos && dtos.length > 0
        ? Result.withContent(
            dtos.map(dto =>
              this.mapper.createEntityFromDocument<EntityType, DocumentType>(dto)
            )
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
   * @param {QueryModel<MongoFindQueryParams<DefaultDocumentType>>} model
   * @returns {Promise<Result<DefaultEntityType>>}
   */
  public async findOne(
    model: QueryModel<MongoFindQueryParams<DefaultDocumentType>>
  ): Promise<Result<DefaultEntityType>> {
    try {
      const { filter, options } = model.toQueryParams();
      const dto = await this.mongoSource.findOne(filter, options);

      return dto
        ? Result.withContent(
            this.mapper.createEntityFromDocument(dto as DefaultDocumentType)
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
   * @param {QueryModel<MongoAggregateParams>} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async aggregate<
    DocumentType = DefaultDocumentType,
    EntityType = DefaultEntityType
  >(model: QueryModel<MongoAggregateParams>): Promise<Result<EntityType[]>> {
    try {
      const { pipeline, options } = model.toQueryParams();
      options.allowDiskUse = true;

      const dtos = await this.mongoSource.aggregate<DocumentType>(pipeline, options);

      return dtos && dtos.length > 0
        ? Result.withContent(
            dtos.map(dto =>
              this.mapper.createEntityFromDocument<EntityType, DocumentType>(dto)
            )
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
   * @param {QueryModel<MongoDeleteQueryParams<DefaultDocumentType>> | DefaultDocumentType} data
   * @returns {Promise<Result<boolean>>}
   */
  public async remove(
    data: QueryModel<MongoDeleteQueryParams<DefaultDocumentType>> | DefaultDocumentType
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
   * @param {QueryModel<MongoDeleteQueryParams<DefaultDocumentType>> | DefaultDocumentType[]} data
   * @returns {Promise<Result<boolean>>}
   */
  public async removeMany(
    data: QueryModel<MongoDeleteQueryParams<DefaultDocumentType>> | DefaultDocumentType[]
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
