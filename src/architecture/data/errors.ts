/**
 * Enum representing the types of operation errors.
 *
 * @enum {string}
 */
export enum OperationErrorType {
  Duplicate = 'duplicate',
  InvalidData = 'invalid_data',
  Other = 'other',
}

/**
 * Interface for additional data in a duplicate error.
 *
 * @type DuplicateErrorAdditionalData
 */
export type DuplicateErrorAdditionalData<DocumentType = unknown> = {
  duplicatedIds?: string[];
  insertedDocuments?: DocumentType[];
  failedDocuments?: DocumentType[];
};

/**
 * Custom error class for DataSource errors.
 *
 * @class DataSourceError
 * @extends {Error}
 * @template AdditionalDataType The type of additional data associated with the error.
 */
export class DataSourceError<AdditionalDataType = unknown> extends Error {
  /**
   * Creates a new DataSourceError instance for a duplicate data error.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {{ message?: string, data?: string[] }} options Options for the error (optional).
   * @returns {DataSourceError<AdditionalDataType>} The DataSourceError instance.
   */
  public static createDuplicateError<DocumentType = unknown>(
    error: Error,
    options?: {
      message?: string;
      duplicatedIds?: string[];
      insertedDocuments?: DocumentType[];
      failedDocuments?: DocumentType[];
    }
  ): DataSourceError {
    const { message, duplicatedIds, insertedDocuments, failedDocuments } = options || {};

    return new DataSourceError<DuplicateErrorAdditionalData>(
      error,
      message || error.message,
      OperationErrorType.Duplicate,
      {
        duplicatedIds: duplicatedIds || [],
        insertedDocuments: insertedDocuments || [],
        failedDocuments: failedDocuments || [],
      }
    );
  }

  /**
   * Creates a new DataSourceError instance for an invalid data error.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {{ message?: string, data?: unknown }} options Options for the error (optional).
   * @returns {DataSourceError<AdditionalDataType>} The DataSourceError instance.
   */
  public static createInvalidDataError<DocumentType = unknown>(
    error: Error,
    options?: {
      message?: string;
      data?: unknown;
      insertedDocuments?: DocumentType[];
      failedDocuments?: DocumentType[];
    }
  ): DataSourceError {
    const { message, data, insertedDocuments, failedDocuments } = options || {};
    return new DataSourceError(
      error,
      message || error.message,
      OperationErrorType.InvalidData,
      {
        data,
        insertedDocuments: insertedDocuments || [],
        failedDocuments: failedDocuments || [],
      }
    );
  }

  /**
   * Creates a new DataSourceError instance for other types of errors.
   *
   * @static
   * @param {Error} error The original error object.
   * @param {{ message?: string, data?: unknown }} options Options for the error (optional).
   * @returns {DataSourceError<AdditionalDataType>} The DataSourceError instance.
   */
  public static createError(
    error: Error,
    options?: { message?: string; data?: unknown }
  ): DataSourceError {
    const { message, data } = options || {};
    return new DataSourceError(
      error,
      message || error.message,
      OperationErrorType.Other,
      data
    );
  }

  /**
   * Constructs a new DataSourceError.
   *
   * @constructor
   * @param {Error} error The original error object.
   * @param {string} message The error message.
   * @param {string} type The type of the error.
   * @param {AdditionalDataType} [additionalData] Additional data associated with the error (optional).
   */
  constructor(
    public readonly error: Error,
    public readonly message: string,
    public readonly type: string,
    public readonly additionalData?: AdditionalDataType
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
