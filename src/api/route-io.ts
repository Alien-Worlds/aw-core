/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, Request } from './api.types';

/**
 * Abstract class representing the Input/Output (IO) contract for a route in a web framework.
 *
 * @abstract
 * @class
 * @template InputType - The type representing the input data from the HTTP request.
 * @template OutputType - The type representing the output data to be sent in the HTTP response.
 */
export abstract class RouteIO<InputType = unknown, OutputType = unknown> {
  /**
   * Convert the output data to an HTTP response.
   *
   * @abstract
   * @public
   * @param {OutputType} output - The output data to be converted into the HTTP response.
   * @returns {Response} The HTTP response object.
   */
  public abstract toResponse?(output: OutputType): Response;

  /**
   * Extract and parse the input data from the HTTP request.
   *
   * @abstract
   * @public
   * @param {Request | unknown} request - The HTTP request object containing the input data.
   * @returns {InputType} The parsed input data extracted from the request.
   */
  public abstract fromRequest?(request: Request | unknown, ...args: unknown[]): InputType;
}
