/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DataSourceBulkWriteError } from '../../domain/errors/data-source-bulk-write.error';

import {
  AggregateOptions,
  Collection,
  CountDocumentsOptions,
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  MatchKeysAndValues,
  ObjectId,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb';
import { MongoSource } from './mongo.source';
import { DataSourceOperationError } from '../../domain/errors/data-source-operation.error';

export type ObjectWithStringId = { _id: string };

/**
 * Represents MongoDB data source.
 * @class
 */
export class CollectionMongoSource<T extends Document = Document> {
  protected collection: Collection<T>;

  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(protected mongoSource: MongoSource, protected collectionName: string) {
    this.collection = this.mongoSource.database.collection<T>(collectionName);
  }

  /**
   * Find a document that matches the filter and options
   *
   * @async
   * @param {Filter<T>} filter
   * @param {FindOptions} options
   * @returns {T}
   * @throws {DataSourceWriteError}
   */
  public async findOne(filter: Filter<T>, options?: FindOptions): Promise<WithId<T>> {
    try {
      return this.collection.findOne(filter, options);
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Find documents that matches the filter and options
   *
   * @async
   * @param {Filter<T>} filter
   * @param {FindOptions} options
   * @returns {T[]}
   * @throws {DataSourceWriteError}
   */
  public async find(filter: Filter<T>, options?: FindOptions): Promise<T[]> {
    try {
      const { sort, limit, skip } = options || {};
      let cursor = this.collection.find<T>(filter);

      if (sort) {
        cursor = cursor.sort(sort);
      }

      if (skip) {
        cursor = cursor.skip(skip);
      }

      if (limit) {
        cursor = cursor.limit(limit);
      }

      const list = await cursor.toArray();
      return list;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Count documents that matches the filter and options
   *
   * @async
   * @param {Filter<T>} filter
   * @param {FindOptions} options
   * @returns {T[]}
   * @throws {DataSourceWriteError}
   */
  public async count(
    filter: Filter<T>,
    options?: CountDocumentsOptions
  ): Promise<number> {
    try {
      return this.collection.countDocuments(filter, options);
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * @async
   * @param {Document[]} pipeline
   * @param {AggregateOptions} options
   * @returns {T[]}
   * @throws {DataSourceWriteError}
   */
  public async aggregate(pipeline: Document[], options?: AggregateOptions): Promise<T[]> {
    try {
      const cursor = this.collection.aggregate<T>(pipeline, options);
      const list = await cursor.toArray();
      return list;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Send updated document to the data source.
   *
   * @async
   * @param {T} dto
   * @returns {T} ID of added document
   * @throws {DataSourceWriteError}
   */
  public async update(dto: T): Promise<T> {
    const { _id, ...dtoWithoutId } = dto as T & Document;
    try {
      await this.collection.updateOne(
        { _id },
        { $set: dtoWithoutId as MatchKeysAndValues<T> }
      );
      return dto;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Add document to the data source.
   *
   * @async
   * @param {T} dto
   * @returns {string} ID of added document
   * @throws {DataSourceWriteError}
   */
  public async insert(dto: T): Promise<string> {
    try {
      const { insertedId } = await this.collection.insertOne(
        dto as OptionalUnlessRequiredId<T>
      );
      return insertedId.toString();
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Insert multiple documents in one set.
   *
   * Documents are inserted in an unordered format and may be
   * reordered by mongod to increase performance.
   *
   * Applications should not depend on ordering of inserts.
   *
   * @async
   * @param {T[]} dtos
   * @returns {string[]} IDs of added documents
   * @throws {DataSourceBulkWriteError}
   */
  public async insertMany(dtos: T[]): Promise<string[]> {
    try {
      const inserted = await this.collection.insertMany(
        dtos as OptionalUnlessRequiredId<T>[],
        {
          ordered: false,
        }
      );
      return Object.values(inserted.insertedIds).map(objectId => objectId.toString());
    } catch (error) {
      throw DataSourceBulkWriteError.create(error);
    }
  }

  /**
   * Remove document from the data source.
   * If the filter is a document, remember that it should contain the _id field.
   * If this field is missing, the document will not be deleted.
   *
   * @async
   * @param {T | Filter<T>} filter - can be a document (DTO) or filter params
   * @returns {boolean}
   * @throws {DataSourceWriteError}
   */
  public async remove(filter: T | Filter<T>, options?: DeleteOptions): Promise<boolean> {
    try {
      const id = (filter as T)._id;
      const delFilter = id && typeof id === 'string' ? { _id: new ObjectId(id) } : filter;
      const { deletedCount } = await this.collection.deleteOne(
        delFilter as Filter<T>,
        options
      );

      return Boolean(deletedCount);
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Remove documents from the data source.
   * If the filter is an array of documents, remember that these documents must contain the _id field.
   * If this field is missing, the document will not be deleted.
   *
   * @async
   * @param {T[] | Filter<T>} filter - can be a list of the documents (DTO[]) or filter params
   * @returns {boolean}
   * @throws {DataSourceWriteError}
   */
  public async removeMany(
    filter: T[] | Filter<T>,
    options?: DeleteOptions
  ): Promise<boolean> {
    try {
      let delFilter;
      if (Array.isArray(filter)) {
        const ids = { _id: { $in: [] } };
        for (const entry of filter) {
          const id = entry._id;
          if (id && typeof id === 'string') {
            ids._id.$in.push(new ObjectId(id));
          } else if (id instanceof ObjectId) {
            ids._id.$in.push(id);
          }
        }
        delFilter = ids;
      } else {
        delFilter = filter;
      }
      const { deletedCount } = await this.collection.deleteMany(delFilter, options);

      return Boolean(deletedCount);
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }
}
