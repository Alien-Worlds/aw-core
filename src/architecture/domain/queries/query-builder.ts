import { Query, UnknownObject } from '../types';

/**
 * A class representing a query builder.
 * @template QueryType - The type of query.
 */
export class QueryBuilder<QueryType = Query> {
  /**
   * The arguments for the query.
   * @protected
   */
  protected args: UnknownObject = {};

  /**
   * Sets the arguments for the query.
   * @param {UnknownObject} args - The arguments for the query.
   * @returns {QueryBuilder<QueryType>} - The updated query builder instance.
   */
  public with(args: UnknownObject): QueryBuilder<QueryType> {
    Object.keys(args).forEach(key => {
      this.args[key] = args[key];
    });

    return this;
  }

  /**
   * Builds and returns the query.
   * @throws {Error} - This method is not implemented.
   * @returns {QueryType} - The built query.
   */
  public build(): QueryType {
    throw new Error('Method not implemented.');
  }
}
