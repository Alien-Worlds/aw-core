import { isQueryModel } from './../../utils/storage.utils';
import { getParams, log } from '../../utils';
import { Failure } from '../domain/failure';
import { Result } from '../domain/result';
import { CollectionSource } from './collection.source';
import { ClusterQueryModel } from '../domain/cluster-query-model';
import { AnyDocumentObject, Cluster, MapFunction } from '../domain/cluster';
import { MongoDB } from '../../storage';

/**
 * @class
 */
export class ClusterImpl<CollectionName extends string> implements Cluster {
  /**
   * @constructor
   * @param {MongoSource} source
   */
  constructor(
    protected sources: Map<CollectionName, CollectionSource>,
    protected mappers: Map<CollectionName, MapFunction>
  ) {}

  public async count(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<number>> {
    const { sources, mappers } = this;
    let size = 0;

    try {
      const params = getParams(model);
      let collections = Array.from(sources.keys());

      if (isQueryModel(model) && model.collections?.length > 0) {
        collections = model.collections as CollectionName[];
      }

      for (const collection of collections) {
        const mapper = mappers.get(collection);
        if (mapper) {
          const collectionCount = await sources
            .get(<CollectionName>collection)
            .count(params);
          size += collectionCount;
        }
      }

      return Result.withContent(size);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async find<Type>(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<Type[]>> {
    const { sources, mappers } = this;
    const result = [];
    try {
      const params = getParams(model);
      let collections = Array.from(sources.keys());

      if (isQueryModel(model) && model.collections?.length > 0) {
        collections = model.collections as CollectionName[];
      }

      for (const collection of collections) {
        const mapper = mappers.get(collection);
        if (mapper) {
          const dtos = await sources.get(<CollectionName>collection).find(params);
          dtos.forEach(dto => {
            result.push(mapper(dto));
          });
        }
      }

      return Result.withContent(result);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  public async findOne<Type>(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<Type>> {
    const { sources, mappers } = this;
    const result = [];

    try {
      const params = getParams(model);
      let collections = Array.from(sources.keys());

      if (isQueryModel(model) && model.collections?.length > 0) {
        collections = model.collections as CollectionName[];
      }

      for (const collection of collections) {
        const mapper = mappers.get(collection);
        if (mapper) {
          const dto = await sources.get(<CollectionName>collection).findOne(params);
          if (dto) {
            result.push(dto);
          }
        }
      }

      if (result.length > 1) {
        log(
          `More than one collection has a matching item, the first one in the list will be returned.`
        );
      }

      return Result.withContent(result[0]);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<Type[]>>}
   */
  public async aggregate<Type>(model: ClusterQueryModel): Promise<Result<Type[]>> {
    try {
      const { sources, mappers } = this;
      const result = [];
      const params = getParams(model) as {
        pipeline: Document[];
        options?: MongoDB.AggregateOptions;
      };
      let collections = Array.from(sources.keys());

      if (isQueryModel(model) && model.collections?.length > 0) {
        collections = model.collections as CollectionName[];
      }

      for (const collection of collections) {
        const mapper = mappers.get(collection);
        if (mapper) {
          const dtos = await sources.get(<CollectionName>collection).aggregate(params);
          dtos.forEach(dto => {
            result.push(mapper(dto));
          });
        }
      }

      return Result.withContent(result);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
