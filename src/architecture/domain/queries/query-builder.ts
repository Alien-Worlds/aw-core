import { Query } from '../types';

/**
 * Represents an abstract QueryBuilder class.
 * @abstract
 */
export abstract class QueryBuilder {
  /**
   * Builds a query using the provided arguments.
   * @param {...unknown[]} args - The arguments needed to build the query.
   * @returns {Query} The built query.
   * @abstract
   */
  public abstract build(...args: unknown[]): Query;
}
