import { DataSourceOperationError } from './data-source-operation.error';
import { AnyError, MongoBulkWriteError } from 'mongodb';

/**
 * @class
 */
export class DataSourceBulkWriteError extends Error {
  /**
   * @private
   * @constructor
   * @param {DataSourceOperationError[]} writeErrors
   * @param {unknown=} concernError
   */
  private constructor(
    public readonly writeErrors: DataSourceOperationError[],
    public readonly concernError?: unknown
  ) {
    super('Some documents were not inserted');
  }

  /**
   * Collect all errors of the mongodb.inserMany operation and return
   * general insert operation error.
   *
   * @static
   * @param {MongoBulkWriteError | AnyError} error
   * @returns {DataSourceBulkWriteError}
   */
  public static create(error: MongoBulkWriteError | AnyError): DataSourceBulkWriteError {
    if (error instanceof MongoBulkWriteError) {
      const writeErrors: DataSourceOperationError[] = [];
      if (Array.isArray(error.writeErrors)) {
        for (const writeError of error.writeErrors) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          writeErrors.push(DataSourceOperationError.fromError(writeError));
        }
      }
      return new DataSourceBulkWriteError(writeErrors, error.err?.toJSON());
    } else {
      return new DataSourceBulkWriteError([], error);
    }
  }
}