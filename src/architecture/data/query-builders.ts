import {
  AggregationParams,
  CountParams,
  FindParams,
  RemoveParams,
  UpdateMethod,
} from '../domain/queries';
import { Query } from '../domain/types';
import { Where } from '../domain/where';

/**
 * @class
 * Represents a collection of query builders for different types of operations.
 */
export abstract class QueryBuilders {
  /**
   * Builds a query for find operations.
   *
   * @param {FindParams} params The parameters for the find operation.
   *
   * @returns {Query} The query for the find operation.
   */
  public abstract buildFindQuery(params: FindParams): Query;

  /**
   * Builds a query for count operations.
   *
   * @param {CountParams} params The parameters for the count operation.
   *
   * @returns {Query} The query for the count operation.
   */
  public abstract buildCountQuery(params: CountParams): Query;

  /**
   * Builds a query for update operations.
   *
   * @param {UpdateType[]} updates
   * @param {Where[]} where
   * @param {UpdateMethod} method
   *
   * @returns {Query} The query for the update operation.
   */
  public abstract buildUpdateQuery<UpdateType = unknown>(
    updates: UpdateType[],
    where: Where[],
    method: UpdateMethod
  ): Query;

  /**
   * Builds a query for remove operations.
   *
   * @param {RemoveParams} params The parameters for the remove operation.
   *
   * @returns {Query} The query for the remove operation.
   */
  public abstract buildRemoveQuery(params: RemoveParams): Query;

  /**
   * Builds a query for aggregation operations.
   *
   * @param {AggregationParams} params The parameters for the aggregation operation.
   *
   * @returns {Query} The query for the aggregation operation.
   */
  public abstract buildAggregationQuery(params: AggregationParams): Query;
}
