export enum OperationErrorType {
  Duplicate = 'duplicate',
  InvalidData = 'invalid_data',
  Other = 'other',
}

/**
 * Custom error class for DataSource errors.
 *
 * @class DataSourceError
 * @extends {Error}
 */
export class DataSourceError extends Error {
  /**
   * Creates a new DataSourceError instance for a duplicate data error.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {string} [message] The error message (optional).
   * @returns {DataSourceError} The DataSourceError instance.
   */
  public static createDuplicateError(error: Error, message?: string): DataSourceError {
    return new DataSourceError(
      error,
      message || error.message,
      OperationErrorType.Duplicate
    );
  }

  /**
   * Creates a new DataSourceError instance for an invalid data error.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {string} [message] The error message (optional).
   * @returns {DataSourceError} The DataSourceError instance.
   */
  public static createInvalidDataError(error: Error, message?: string): DataSourceError {
    return new DataSourceError(
      error,
      message || error.message,
      OperationErrorType.InvalidData
    );
  }

  /**
   * Creates a new DataSourceError instance for other types of errors.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {string} [message] The error message (optional).
   * @returns {DataSourceError} The DataSourceError instance.
   */
  public static createError(error: Error, message?: string): DataSourceError {
    return new DataSourceError(error, message || error.message, OperationErrorType.Other);
  }

  /**
   * Constructs a new DataSourceError.
   *
   * @constructor
   * @param {unknown} error The original error object.
   * @param {string} message The error message.
   * @param {string} type The type of the error.
   */
  constructor(
    public readonly error: unknown,
    public readonly message: string,
    public readonly type: string
  ) {
    super(message);
  }

  /**
   * Indicates if the error is a duplicate data error.
   *
   * @readonly
   * @type {boolean}
   */
  public get isDuplicateError() {
    return this.type === OperationErrorType.Duplicate;
  }

  /**
   * Indicates if the error is an invalid data error.
   *
   * @readonly
   * @type {boolean}
   */
  public get isInvalidDataError() {
    return this.type === OperationErrorType.InvalidData;
  }
}
