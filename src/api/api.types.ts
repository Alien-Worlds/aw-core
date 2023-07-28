import { Socket } from 'net';

import { IO } from '../architecture';

/**
 * Represents the response object returned by route handlers.
 * @template T - Type of the response body.
 */
export type Response<T = unknown> = {
  body?: T;
  status: number;
  type?: string;
  headers?: object;
  socket?: Socket;
};

/**
 * Represents the request object received by route handlers.
 * @template BodyType - Type of the request body.
 * @template ParamsType - Type of the request parameters.
 * @template QueryType - Type of the request query.
 */
export interface Request<BodyType = unknown, ParamsType = object, QueryType = unknown> {
  body: BodyType;
  params: ParamsType;
  query: QueryType;
  headers: object;
  [key: string]: unknown;
}

/**
 * Represents the pre and post hooks for route handling.
 */
export type RouteHooks = {
  pre?: <T = Request>(request: T) => void;
  post?: (output?: IO) => void;
};

/**
 * Represents the result of a validation process.
 */
export type ValidationResult = {
  valid: boolean;
  message?: string;
  code?: number;
  errors?: string[];
};

/**
 * Represents the validators for request and response.
 */
export type Validators = {
  request?: (...args: unknown[]) => ValidationResult;
  response?: {
    [status: number]: (...args: unknown[]) => ValidationResult;
  };
};

/**
 * Represents the options for configuring a route.
 */
export type RouteOptions = {
  hooks?: RouteHooks;
  validators?: Validators;
  authorization?: (request: Request) => boolean;
};

/**
 * Represents the handler function for a route.
 */
export type RouteHandler = (input: IO) => IO;
