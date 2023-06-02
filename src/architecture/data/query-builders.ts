import {
  AggregationParams,
  CountParams,
  FindParams,
  QueryBuilder,
  RemoveParams,
  UpdateParams,
} from '../domain/queries';
import { Query } from '../domain/types';

/**
 * @class
 * Represents a collection of query builders for different types of operations.
 */
export class QueryBuilders {
  /**
   * @constructor
   * Creates a new QueryBuilders instance.
   *
   * @param {QueryBuilder} findQueryBuilder The QueryBuilder for find operations.
   * @param {QueryBuilder} countQueryBuilder The QueryBuilder for count operations.
   * @param {QueryBuilder} updateQueryBuilder The QueryBuilder for update operations.
   * @param {QueryBuilder} removeQueryBuilder The QueryBuilder for remove operations.
   * @param {QueryBuilder} aggregationQueryBuilder The QueryBuilder for aggregation operations.
   */
  constructor(
    private readonly findQueryBuilder: QueryBuilder,
    private readonly countQueryBuilder: QueryBuilder,
    private readonly updateQueryBuilder: QueryBuilder,
    private readonly removeQueryBuilder: QueryBuilder,
    private readonly aggregationQueryBuilder: QueryBuilder
  ) {}

  /**
   * Builds a query for find operations.
   *
   * @param {FindParams} params The parameters for the find operation.
   *
   * @returns {Query} The query for the find operation.
   */
  public buildFindQuery(params: FindParams): Query {
    return this.findQueryBuilder.build(params);
  }

  /**
   * Builds a query for count operations.
   *
   * @param {CountParams} params The parameters for the count operation.
   *
   * @returns {Query} The query for the count operation.
   */
  public buildCountQuery(params: CountParams): Query {
    return this.countQueryBuilder.build(params);
  }

  /**
   * Builds a query for update operations.
   *
   * @param {UpdateParams} params The parameters for the update operation.
   *
   * @returns {Query} The query for the update operation.
   */
  public buildUpdateQuery(params: UpdateParams): Query {
    return this.updateQueryBuilder.build(params);
  }

  /**
   * Builds a query for remove operations.
   *
   * @param {RemoveParams} params The parameters for the remove operation.
   *
   * @returns {Query} The query for the remove operation.
   */
  public buildRemoveQuery(params: RemoveParams): Query {
    return this.removeQueryBuilder.build(params);
  }

  /**
   * Builds a query for aggregation operations.
   *
   * @param {AggregationParams} params The parameters for the aggregation operation.
   *
   * @returns {Query} The query for the aggregation operation.
   */
  public buildAggregationQuery(params: AggregationParams): Query {
    return this.aggregationQueryBuilder.build(params);
  }
}
