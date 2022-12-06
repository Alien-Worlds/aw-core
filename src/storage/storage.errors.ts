import { AnyError, MongoBulkWriteError, MongoError, WriteError } from 'mongodb';

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

export enum OperationErrorType {
  Duplicate,
  InvalidData,
  Other,
}

/**
 * Represents an error in sending a document to a data source.
 *
 * @class
 */
export class DataSourceOperationError extends Error {
  /**
   * @private
   * @constructor
   * @param {string} message
   * @param {number} index
   * @param {OperationErrorType} type
   * @param {Error} error
   */
  private constructor(
    public readonly message: string,
    public readonly index: number,
    public readonly type: OperationErrorType,
    public readonly error: unknown
  ) {
    super(message);
  }

  public get isDuplicateError() {
    return this.type === OperationErrorType.Duplicate;
  }

  public get isInvalidDataError() {
    return this.type === OperationErrorType.InvalidData;
  }

  private static getTypeByErrorMessage(message: string): OperationErrorType {
    if (message.indexOf('key') !== -1 && message.indexOf('must not contain') !== -1) {
      return OperationErrorType.InvalidData;
    }

    if (message.indexOf('E11000') !== -1) {
      return OperationErrorType.Duplicate;
    }

    return OperationErrorType.Other;
  }

  /**
   * Create DataSourceWriteError instance.
   *
   * @static
   * @param {MongoError | Error | WriteError} error
   * @returns {DataSourceOperationError<T>}
   */
  public static fromError(
    error: MongoError | Error | WriteError
  ): DataSourceOperationError {
    const index = (<WriteError>error).index ? (<WriteError>error).index : -1;
    const message = (<WriteError>error).errmsg
      ? (<WriteError>error).errmsg
      : (<Error>error).message;
    const type = this.getTypeByErrorMessage(message);

    return new DataSourceOperationError(message, index, type, error);
  }
}

export class DocumentAlreadyExistsError extends Error {
  constructor() {
    super(`Document already exists.`);
  }
}

/**
 * Represents an error thrown by the insertMany operation
 *
 * @class
 */
export class InsertManyError<EntityType = unknown> extends Error {
  /**
   * @private
   * @constructor
   */
  private constructor(
    public readonly insertedEntities: EntityType[],
    public readonly duplicatedEntities: EntityType[],
    public readonly skippedEntities: EntityType[],
    public readonly concernError: unknown
  ) {
    super('Insert many documents error');
  }

  /**
   * Create InsertManyError instance with grouped entities
   * for further handling.
   *
   * @static
   * @param {EntityType} entities
   * @param {DataSourceOperationError[]} writeErrors
   * @param {unknown} concernError
   * @returns {InsertManyError<EntityType>}
   */
  public static create<EntityType>(
    entities: EntityType[],
    writeErrors: DataSourceOperationError[],
    concernError: unknown
  ): InsertManyError<EntityType> {
    type Groups = {
      duplicates: EntityType[];
      skipped: EntityType[];
    };
    const groups: Groups = {
      duplicates: [],
      skipped: [],
    };
    // Group the entities based on the type of error.
    // --
    // Entity whose index matches the error index will be moved
    // to the appropriate group and replaced with null
    // in the original array to allow filtering those entities
    // that have been sent.
    if (Array.isArray(writeErrors) && writeErrors.length > 0) {
      writeErrors.reduce((collection, writeError) => {
        const entity = entities[writeError.index];
        entities[writeError.index] = null;

        if (writeError.isDuplicateError) {
          collection.duplicates.push(entity);
        } else {
          collection.skipped.push(entity);
        }

        return collection;
      }, groups);

      return new InsertManyError<EntityType>(
        // filter sent entities
        entities.filter(entity => !!entity),
        groups.duplicates,
        groups.skipped,
        concernError
      );
    }
    // In case the error does not contain writeErrors, it means
    // another general error, in which case the entities should
    // be returned as skipped
    return new InsertManyError([], [], entities, concernError);
  }
}

export class InsertOnceError extends Error {}

/**
 * Represents an error thrown by the insertOne operation
 *
 * @class
 */
export class InsertError<EntityType = unknown> extends Error {
  /**
   * @private
   * @constructor
   */
  private constructor(
    public readonly entity: EntityType,
    public readonly type: OperationErrorType,
    public readonly error: unknown
  ) {
    super('Insert document error');
  }

  /**
   * Create InsertManyError instance with grouped entities
   * for further handling.
   *
   * @static
   * @param {EntityType} entities
   * @param {DataSourceOperationError[]} writeErrors
   * @param {unknown} concernError
   * @returns {InsertManyError<EntityType>}
   */
  public static create<EntityType>(
    entity: EntityType,
    type: OperationErrorType,
    concernError: unknown
  ): InsertError<EntityType> {
    return new InsertError(entity, type, concernError);
  }
}
