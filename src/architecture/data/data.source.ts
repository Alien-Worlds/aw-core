import { Query, RemoveStats, UnknownObject, UpdateStats } from '../domain/types';

/**
 * @abstract
 * @class
 * Represents a general interface for the data sources in the application.
 *
 * This abstract class should be implemented by concrete data source classes that interact with a specific type of database.
 */
export abstract class DataSource<DocumentType = unknown> {
  public collectionName: string;

  /**
   * Abstract method to find documents in the data source that match the provided query.
   *
   * @param {Query} [query] The search criteria.
   * @returns {Promise<DocumentType[]>} A promise that resolves to an array of documents.
   * @abstract
   */
  public abstract find(query?: Query): Promise<DocumentType[]>;

  /**
   * Abstract method to count documents in the data source that match the provided query.
   *
   * @param {Query} [query] The search criteria.
   * @returns {Promise<number>} A promise that resolves to the count of documents.
   * @abstract
   */
  public abstract count(query?: Query): Promise<number>;

  /**
   * Abstract method to perform an aggregation operation on the data source.
   *
   * @param {Query} query The aggregation criteria.
   * @returns {Promise<T[]>} A promise that resolves to the result of the aggregation operation.
   * @abstract
   */
  public abstract aggregate<T = DocumentType>(query: Query): Promise<T[]>;

  /**
   * Abstract method to update documents in the data source.
   *
   * @param {Query} query The update criteria and new document data.
   * @returns {Promise<UpdateStats>} A promise that resolves to the update statistics.
   * @abstract
   */
  public abstract update(query: Query): Promise<UpdateStats>;

  /**
   * Abstract method to insert documents into the data source.
   *
   * @param {Query} query The documents to insert.
   * @returns {Promise<DocumentType[]>} A promise that resolves to the inserted documents.
   * @abstract
   */
  public abstract insert(query: Query): Promise<DocumentType[]>;

  /**
   * Abstract method to remove documents from the data source.
   *
   * @param {Query} query The removal criteria.
   * @returns {Promise<RemoveStats>} A promise that resolves to the removal statistics.
   * @abstract
   */
  public abstract remove(query: Query): Promise<RemoveStats>;

  /**
   * Abstract method to start a database transaction.
   *
   * @param {UnknownObject} [options] Transaction options.
   * @returns {Promise<void>} A promise that resolves when the transaction starts.
   * @abstract
   */
  public abstract startTransaction(options?: UnknownObject): Promise<void>;

  /**
   * Abstract method to commit a database transaction.
   *
   * @returns {Promise<void>} A promise that resolves when the transaction commits.
   * @abstract
   */
  public abstract commitTransaction(): Promise<void>;

  /**
   * Abstract method to rollback a database transaction.
   *
   * @returns {Promise<void>} A promise that resolves when the transaction rollbacks.
   * @abstract
   */
  public abstract rollbackTransaction(): Promise<void>;
}
