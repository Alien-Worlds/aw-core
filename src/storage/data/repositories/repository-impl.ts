/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Failure, QueryModel, Result } from '../../../architecture';
import { getParams, isQueryModel } from '../../../utils';
import { Repository } from '../../domain/repositories/repository';
import { UpdateResult } from '../../domain/storage.enums';
import { EntityNotFoundError } from '../../domain/storage.errors';
import { CollectionSource } from '../data-sources/collection.source';
import { Mapper } from '../mappers/mapper';

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
   * @param {QueryModel} model
   * @returns {Promise<Result<UpdateResult.Success | UpdateResult.Failure, Error>>}
   */
  public async update(
    entity: EntityType,
    model?: QueryModel | DocumentType
  ): Promise<Result<UpdateResult.Success | UpdateResult.Failure>> {
    try {
      const data = this.mapper.createDocumentFromEntity(entity);
      const params = getParams(model);

      const document = await this.source.update(data, params);

      return document
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
      const { modifiedCount, upsertedCount } = await this.source.updateMany(documents);

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
      const dto = this.mapper.createDocumentFromEntity(entity);
      const insertedDocument = await this.source.insert(dto);
      return Result.withContent(this.mapper.createEntityFromDocument(insertedDocument));
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
      const result = await this.source.update(dto);

      if (result) {
        return Result.withContent(this.mapper.createEntityFromDocument(result));
      }
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async find(model: QueryModel | DocumentType): Promise<Result<EntityType[]>> {
    try {
      const params = getParams(model);
      const dtos = await this.source.find(params);

      return dtos && dtos.length > 0
        ? Result.withContent(dtos.map(dto => this.mapper.createEntityFromDocument(dto)))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.source.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<EntityType>>}
   */
  public async findOne(model: QueryModel | DocumentType): Promise<Result<EntityType>> {
    try {
      const params = getParams(model);
      const dto = await this.source.findOne(params);

      return dto
        ? Result.withContent(this.mapper.createEntityFromDocument(dto as DocumentType))
        : Result.withFailure(
            Failure.fromError(new EntityNotFoundError(this.source.collectionName))
          );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<EntityType[]>>}
   */
  public async aggregate(
    model: QueryModel | DocumentType
  ): Promise<Result<EntityType[]>> {
    try {
      const params = getParams(model);
      const dtos = await this.source.aggregate(params);

      return dtos && dtos.length > 0
        ? Result.withContent(dtos.map(dto => this.mapper.createEntityFromDocument(dto)))
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
