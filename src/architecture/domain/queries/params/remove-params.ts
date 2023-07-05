import { Where } from '../../where/where';

/**
 * Represents the parameters for removing.
 */
export class RemoveParams {
  /**
   * Creates a new instance of RemoveParams with the provided options.
   * @static
   * @param {Where} where - The where clause for removing.
   * @returns {RemoveParams} A new instance of RemoveParams.
   */
  public static create(where: Where): RemoveParams {
    return new RemoveParams(where);
  }

  /**
   * Constructs a new instance of RemoveParams.
   * @param {Where} [where] - The where clause for removing.
   */
  constructor(public readonly where?: Where) {}
}
