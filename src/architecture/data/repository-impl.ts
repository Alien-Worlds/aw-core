import { getParams, isQueryModel } from '../../utils';
import { Failure } from '../domain/failure';
import { QueryModel } from '../domain/query-model';
import { Repository } from '../domain/repository';
import { EntityNotFoundError } from '../domain/repository.errors';
import { Result } from '../domain/result';
import { CollectionSource } from './collection.source';
import { UpdateStatus } from './collection.types';
import { Mapper } from './mapper';

/**
 * @class
 */
export class RepositoryImpl<EntityType, DocumentType>
  implements Repository<EntityType, DocumentType>
{
  /**
   * @constructor
   * @param {MongoSource} source
   */
  constructor(
    protected source: CollectionSource<DocumentType>,
    protected mapper: Mapper<EntityType, DocumentType>
  ) {}

  /**
   *
   * @param {EntityType} entity
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<UpdateStatus.Success | UpdateStatus.Failure, Error>>}
   */
  public async update(
    entity: EntityType,
    model?: QueryModel | DocumentType
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    try {
      const data = this.mapper.toDataObject(entity);
      const params = getParams(model);

      const document = await this.source.update(data, params);

      return document
        ? Result.withContent(UpdateStatus.Success)
        : Result.withContent(UpdateStatus.Failure);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
  /**
   *
   * @param {EntityType[]} entities
   * @returns {Promise<Result<UpdateStatus>>}
   */
  public async updateMany(entities: EntityType[]): Promise<Result<UpdateStatus>> {
    try {
      const documents = entities.map(entity => this.mapper.toDataObject(entity));
      const { modifiedCount, upsertedCount } = await this.source.updateMany(documents);

      const operationsCount = modifiedCount + upsertedCount;

      return operationsCount === documents.length
        ? Result.withContent(UpdateStatus.Success)
        : operationsCount > 0 && operationsCount < documents.length
        ? Result.withContent(UpdateStatus.Partial)
        : Result.withContent(UpdateStatus.Failure);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * @async
   * @param {QueryModel | DocumentType} model
   * @returns {number}
   */
  public async count(model: QueryModel | DocumentType): Promise<Result<number>> {
    try {
      const params = getParams(model);
      const count = await this.source.count(params);

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
      const dto = this.mapper.toDataObject(entity);
      const insertedDocument = await this.source.insert(dto);
      return Result.withContent(this.mapper.toEntity(insertedDocument));
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
      const dto = this.mapper.toDataObject(entity);
      const result = await this.source.update(dto);

      if (result) {
        return Result.withContent(this.mapper.toEntity(result));
      }
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async find(model: QueryModel | DocumentType): Promise<Result<EntityType[]>> {
    try {
      const params = getParams(model);
      const dtos = await this.source.find(params);

      return dtos && dtos.length > 0
        ? Result.withContent(dtos.map(dto => this.mapper.toEntity(dto)))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.source.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType>>}
   */
  public async findOne(model: QueryModel | DocumentType): Promise<Result<EntityType>> {
    try {
      const params = getParams(model);
      const dto = await this.source.findOne(params);

      return dto
        ? Result.withContent(this.mapper.toEntity(dto as DocumentType))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.source.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel | DocumentType} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async aggregate(
    model: QueryModel | DocumentType
  ): Promise<Result<EntityType[]>> {
    try {
      const params = getParams(model);
      const dtos = await this.source.aggregate(params);

      return dtos && dtos.length > 0
        ? Result.withContent(dtos.map(dto => this.mapper.toEntity(dto)))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.source.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel | DocumentType} data
   * @returns {Promise<Result<boolean>>}
   */
  public async remove(data: QueryModel | DocumentType): Promise<Result<boolean>> {
    try {
      let removed = false;

      if (isQueryModel(data)) {
        removed = await this.source.remove(data.toQueryParams());
      } else {
        removed = await this.source.remove(data);
      }

      return Result.withContent(removed);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel | DocumentType[]} data
   * @returns {Promise<Result<boolean>>}
   */
  public async removeMany(data: QueryModel | DocumentType[]): Promise<Result<boolean>> {
    try {
      let removed = false;
      if (Array.isArray(data)) {
        removed = await this.source.removeMany(data);
      } else {
        removed = await this.source.removeMany(data.toQueryParams());
      }

      return Result.withContent(removed);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
