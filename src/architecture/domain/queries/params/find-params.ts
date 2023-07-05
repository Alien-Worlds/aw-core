import { Sort } from '../../types';
import { Where } from '../../where/where';

/**
 * Represents the parameters for finding.
 */
export class FindParams {
  /**
   * Creates a new instance of FindParams with the provided options.
   * @static
   * @param {Object} options - The options for creating FindParams.
   * @param {number} options.limit - The limit of results to retrieve.
   * @param {number} options.offset - The offset of results to skip.
   * @param {Sort} options.sort - The sorting criteria.
   * @param {Where} options.where - The where clause.
   * @returns {FindParams} A new instance of FindParams.
   */
  public static create(options: {
    limit?: number;
    offset?: number;
    sort?: Sort;
    where?: Where;
  }): FindParams {
    const { limit, sort, offset, where } = options || {};
    return new FindParams(limit, offset, sort, where);
  }
  /**
   * Constructs a new instance of FindParams.
   * @param {number} [limit] - The limit of results to retrieve.
   * @param {number} [offset] - The offset of results to skip.
   * @param {Sort} [sort] - The sorting criteria.
   * @param {Where} [where] - The where clause.
   */
  constructor(
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly sort?: Sort,
    public readonly where?: Where
  ) {}
}
