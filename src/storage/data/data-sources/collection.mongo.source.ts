/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  AggregateOptions,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
  Collection,
  CountDocumentsOptions,
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  MatchKeysAndValues,
  ObjectId,
  OptionalUnlessRequiredId,
} from 'mongodb';
import { MongoSource } from './mongo.source';
import { UpdateManyResult } from '../mongo.types';
import { CollectionSource, UpdateParams } from './collection.source';
import {
  DataSourceBulkWriteError,
  DataSourceOperationError,
} from '../../domain/storage.errors';

export type ObjectWithStringId = { _id: string };

/**
 * Represents MongoDB data source.
 * @class
 */
export class CollectionMongoSource<T extends Document = Document>
  implements CollectionSource<T>
{
  protected collection: Collection<T>;

  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(
    protected mongoSource: MongoSource,
    public readonly collectionName: string
  ) {
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
  public async findOne<DocumentType = T>(params: {
    filter: Filter<T>;
    options?: FindOptions;
  }): Promise<DocumentType> {
    try {
      const { filter, options } = params;
      return this.collection.findOne<DocumentType>(filter, options);
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
  public async find<DocumentType = T>(params: {
    filter: Filter<T>;
    options?: FindOptions;
  }): Promise<DocumentType[]> {
    try {
      const { filter, options } = params;
      const { sort, limit, skip } = options || {};
      let cursor = this.collection.find<DocumentType>(filter);

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
  public async count(params: {
    filter?: Filter<T>;
    options?: CountDocumentsOptions;
  }): Promise<number> {
    const { filter, options } = params;
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
  public async aggregate<DocumentType = T>(params: {
    pipeline: Document[];
    options?: AggregateOptions;
  }): Promise<DocumentType[]> {
    try {
      const { pipeline, options } = params;
      if (options) {
        options.allowDiskUse = true;
      }
      const cursor = this.collection.aggregate<DocumentType>(pipeline, options);
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
   * @param {DocumentType} data
   * @param {UpdateParams} params
   * @returns {DocumentType}
   * @throws {DataSourceWriteError}
   */
  public async update<DocumentType = T>(
    data: DocumentType,
    params?: { where?: Filter<T>; options?: unknown }
  ): Promise<DocumentType> {
    try {
      const { where, options } = params || {};
      const { _id, ...dtoWithoutId } = data as T & Document;
      const filter = { $set: dtoWithoutId as MatchKeysAndValues<T> };
      const match = where ? where : _id ? { _id } : {};

      const { upsertedId, modifiedCount } = await this.collection.updateOne(
        match,
        filter,
        options || { upsert: true }
      );

      if (upsertedId) {
        (data as ObjectWithStringId)._id = upsertedId.toString();
        return data;
      }

      if (modifiedCount > 0) {
        return data;
      }

      return null;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Send updated documents to the data source.
   *
   * @async
   * @param {DocuemntType[]} data
   * @param {UpdateOptions} params
   * @returns {UpdateManyResult}
   * @throws {DataSourceWriteError}
   */
  public async updateMany<DocumentType = T>(
    data: DocumentType[],
    params?: { where?: Filter<T>; options?: unknown }
  ): Promise<UpdateManyResult> {
    try {
      const { where, options } = params || {};
      const operations = data.map(dto => {
        const { _id, ...dtoWithoutId } = dto as unknown as T & Document;
        const filter = where ? where : _id ? { _id } : {};
        return {
          updateOne: {
            filter,
            update: { $set: dtoWithoutId as MatchKeysAndValues<T> },
          },
        };
      });
      const { modifiedCount, upsertedCount, upsertedIds } =
        await this.collection.bulkWrite(operations, options);
      return { modifiedCount, upsertedCount, upsertedIds };
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
  public async insert(dto: T): Promise<T> {
    try {
      const { insertedId } = await this.collection.insertOne(
        dto as OptionalUnlessRequiredId<T>
      );
      (dto as unknown as ObjectWithStringId)._id = insertedId.toString();
      return dto;
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
  public async insertMany(dtos: T[]): Promise<T[]> {
    try {
      const inserted = await this.collection.insertMany(
        dtos as OptionalUnlessRequiredId<T>[],
        {
          ordered: false,
        }
      );
      return dtos.map((dto, i) => {
        (dto as unknown as ObjectWithStringId)._id = inserted.insertedIds[i].toString();
        return dto;
      });
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
   * @param {T | Filter<T>} data - can be a document (DTO) or filter params
   * @returns {boolean}
   * @throws {DataSourceWriteError}
   */
  public async remove(
    data: T | { filter: T | Filter<T>; options?: DeleteOptions }
  ): Promise<boolean> {
    try {
      const id = (data as T)._id;
      let filter: Filter<T>;
      let options: DeleteOptions;
      if (id && typeof id === 'string') {
        filter = { _id: new ObjectId(id) } as unknown as Filter<T>;
      } else {
        filter = data.filter;
        options = data.options;
      }

      const { deletedCount } = await this.collection.deleteOne(filter, options);

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
   * @param {T[] | Filter<T>} data - can be a list of the documents (DTO[]) or filter params
   * @returns {boolean}
   * @throws {DataSourceWriteError}
   */
  public async removeMany(
    data: T[] | { filter?: Filter<T>; options?: DeleteOptions }
  ): Promise<boolean> {
    try {
      let filter;
      let options: DeleteOptions;
      if (Array.isArray(data)) {
        const ids = { _id: { $in: [] } };
        for (const entry of data) {
          const id = entry._id;
          if (id && typeof id === 'string') {
            ids._id.$in.push(new ObjectId(id));
          } else if (id instanceof ObjectId) {
            ids._id.$in.push(id);
          }
        }
        filter = ids;
      } else {
        filter = data.filter;
        options = data.options;
      }
      const { deletedCount } = await this.collection.deleteMany(filter, options);

      return Boolean(deletedCount);
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  /**
   * Takes an array of write operations and executes each of them.
   * By default operations are executed in order.
   *
   * @async
   * @param {AnyBulkWriteOperation<T>[]} operations
   * @param {BulkWriteOptions} options
   * @returns {BulkWriteResult}
   * @throws {DataSourceWriteError}
   */
  public async composedOperation(
    operations: AnyBulkWriteOperation<T>[],
    options?: BulkWriteOptions
  ): Promise<BulkWriteResult> {
    try {
      const result = await this.collection.bulkWrite(operations, options);

      return result;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }
}
