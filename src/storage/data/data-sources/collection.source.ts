import { UpdateManyResult } from '../mongo.types';

export type UpdateParams = { where?: unknown; options?: unknown };

/**
 * @abstract
 * @class
 */
export abstract class CollectionSource<DocumentType> {
  public collectionName: string;

  /**
   * Find a document that matches the filter and options
   *
   * @async
   * @returns {DocumentType}
   * @throws {DataSourceWriteError}
   */
  public abstract findOne(params: unknown): Promise<DocumentType>;

  /**
   * Find documents that matches the filter and options
   *
   * @async
   * @returns {DocumentType[]}
   * @throws {DataSourceWriteError}
   */
  public abstract find(params: unknown): Promise<DocumentType[]>;

  /**
   * Count documents that matches the filter and options
   *
   * @async
   * @returns {number}
   * @throws {DataSourceWriteError}
   */
  public abstract count(params: unknown): Promise<number>;

  /**
   * @async
   * @returns {DocumentType[]}
   * @throws {DataSourceWriteError}
   */
  public abstract aggregate<T = DocumentType>(params: unknown): Promise<T[]>;

  /**
   * Send updated document to the data source.
   *
   * @async
   * @throws {DataSourceWriteError}
   */
  public abstract update(
    data: DocumentType,
    params?: UpdateParams
  ): Promise<DocumentType>;

  /**
   * Send updated documents to the data source.
   *
   * @async
   * @returns {UpdateManyResult}
   * @throws {DataSourceWriteError}
   */
  public abstract updateMany(
    data: DocumentType[],
    params?: UpdateParams
  ): Promise<UpdateManyResult>;

  /**
   * Add document to the data source.
   *
   * @async
   * @param {DocumentType} dto
   * @returns {DocumentType}
   * @throws {DataSourceWriteError}
   */
  public abstract insert(dto: DocumentType): Promise<DocumentType>;

  /**
   * Insert multiple documents in one set.
   *
   * @async
   * @param {DocumentType[]} dtos
   * @returns {DocumentType[]} IDs of added documents
   * @throws {DataSourceBulkWriteError}
   */
  public abstract insertMany(dtos: DocumentType[]): Promise<DocumentType[]>;

  /**
   * Remove document from the data source.
   * If the filter is a document, remember that it should contain the _id field.
   * If this field is missing, the document will not be deleted.
   *
   * @async
   * @param {DocumentType | unknown} data - can be a document (DTO) or filter params
   * @returns {boolean}
   * @throws {DataSourceWriteError}
   */
  public abstract remove(data: DocumentType | unknown): Promise<boolean>;

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
  public abstract removeMany(data: DocumentType[] | unknown): Promise<boolean>;

  /**
   * Takes an array of write operations and executes each of them.
   * By default operations are executed in order.
   *
   * @async
   * @param {unknown[]} operations
   * @param {unknown} options
   * @returns {unknown}
   * @throws {DataSourceWriteError}
   */
  public abstract composedOperation(
    operations: unknown[],
    options?: unknown
  ): Promise<unknown>;
}
