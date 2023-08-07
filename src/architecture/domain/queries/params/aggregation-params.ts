import { Filter, Sort } from '../../types';
import { Where } from '../../where/where';

/**
 * Represents the parameters for aggregation.
 */
export class AggregationParams {
  /**
   * Creates a new instance of AggregationParams with the provided options.
   * @static
   * @param {Object} options - The options for creating AggregationParams.
   * @param {string[]} options.groupBy - The field to group by.
   * @param {Filter} options.filterBy - The filter to apply.
   * @param {Sort} options.sort - The sorting criteria.
   * @param {string} options.sum - The field to calculate the sum.
   * @param {string} options.average - The field to calculate the average.
   * @param {string} options.min - The field to calculate the minimum value.
   * @param {string} options.max - The field to calculate the maximum value.
   * @param {string} options.count - The field to count.
   * @param {Where} options.where - The where clause.
   * @returns {AggregationParams} A new instance of AggregationParams.
   */
  public static create(options: {
    groupBy?: string[];
    filterBy?: Filter;
    sort?: Sort;
    sum?: string;
    average?: string;
    min?: string;
    max?: string;
    count?: string;
    where?: Where;
  }): AggregationParams {
    const { groupBy, filterBy, sort, sum, average, min, max, count, where } = options;
    return new AggregationParams(
      groupBy,
      filterBy,
      sort,
      sum,
      average,
      min,
      max,
      count,
      where
    );
  }

  /**
   * Constructs a new instance of AggregationParams.
   * @param {string[]} [groupBy] - The field to group by.
   * @param {Filter} [filterBy] - The filter to apply.
   * @param {Sort} [sort] - The sorting criteria.
   * @param {string} [sum] - The field to calculate the sum.
   * @param {string} [average] - The field to calculate the average.
   * @param {string} [min] - The field to calculate the minimum value.
   * @param {string} [max] - The field to calculate the maximum value.
   * @param {string} [count] - The field to count.
   * @param {Where} [where] - The where clause.
   */
  constructor(
    public readonly groupBy?: string[],
    public readonly filterBy?: Filter,
    public readonly sort?: Sort,
    public readonly sum?: string,
    public readonly average?: string,
    public readonly min?: string,
    public readonly max?: string,
    public readonly count?: string,
    public readonly where?: Where
  ) {}
}
