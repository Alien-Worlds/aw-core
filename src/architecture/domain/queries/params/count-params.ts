import { Sort } from '../../types';
import { Where } from '../../where/where';

/**
 * Represents the parameters for counting.
 */
export class CountParams {
  /**
   * Creates a new instance of CountParams with the provided options.
   * @static
   * @param {Object} options - The options for creating CountParams.
   * @param {Sort} options.sort - The sorting criteria.
   * @param {Where} options.where - The where clause.
   * @returns {CountParams} A new instance of CountParams.
   */
  public static create(options: { sort?: Sort; where?: Where }): CountParams {
    const { sort, where } = options || {};
    return new CountParams(sort, where);
  }

  /**
   * Constructs a new instance of CountParams.
   * @param {Sort} [sort] - The sorting criteria.
   * @param {Where} [where] - The where clause.
   */
  constructor(public readonly sort?: Sort, public readonly where?: Where) {}
}
