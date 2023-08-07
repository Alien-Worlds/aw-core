/* istanbul ignore file */
import { Result } from './result';

/**
 * Represents an abstract UseCase class.
 * @abstract
 * @class
 * @template T - The type of the result from executing the use case.
 */
export abstract class UseCase<T = unknown> {
  /**
   * Executes the use case with the provided arguments.
   * @abstract
   * @param {...unknown[]} rest - Additional arguments for executing the use case.
   * @returns {Promise<Result<T>> | Result<T> | void} A promise or result of the execution.
   */
  public abstract execute(...rest: unknown[]): Promise<Result<T>> | Result<T> | void;
}
