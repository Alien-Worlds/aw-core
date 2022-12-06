/* eslint-disable @typescript-eslint/no-explicit-any */
import { Failure } from './failure';

/**
 * The class represents the result of executing a use case
 * or repository operation.
 * The result may return a Failure object or the typed content.
 * @class
 */
export class Result<ContentType = void, ErrorType = Error> {
  public readonly content: ContentType;
  public readonly failure: Failure<ErrorType> | undefined;

  /**
   * Create instances of the class Result
   *
   * @constructor
   * @private
   * @param data
   */
  private constructor(data: { content?: ContentType; failure?: Failure<ErrorType> }) {
    const { content, failure } = data || {};
    if (content !== undefined && content !== null) {
      this.content = content;
    }
    if (failure) {
      this.failure = failure;
    }
  }

  /**
   * @returns {boolean}
   */
  public get isFailure(): boolean {
    return !!this.failure;
  }

  /**
   * Create instance of the Result class with the content
   *
   * @static
   * @param {ContentType} content
   * @returns {Result<ContentType>}
   */
  public static withContent<ContentType>(content: ContentType): Result<ContentType, null> {
    return new Result<ContentType, null>({ content });
  }

  /**
   * Create instance of the Result class with empty content
   *
   * @static
   * @returns {Result<void>}
   */
  public static withoutContent(): Result<void> {
    return new Result({});
  }

  /**
   * Create instance of the Result class with the failure
   *
   * @static
   * @param {Failure} failure
   * @returns
   */
   public static withFailure<ErrorType>(failure: Failure<ErrorType>): Result<null, ErrorType> {
    return new Result<null, ErrorType>({ failure });
  }
}
