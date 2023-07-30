/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Represents an abstract IO (Input/Output) class.
 * @abstract
 * @template JsonType - The type of the JSON representation of the IO.
 */
export abstract class IO<JsonType = unknown> {
  /**
   * Converts the IO to its JSON representation.
   * @abstract
   * @returns {JsonType} The JSON representation of the IO.
   */
  public abstract toJSON(): JsonType;
}
