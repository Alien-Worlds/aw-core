import { Socket } from 'net';

import { Result } from '../architecture';

export type Response<T = unknown> = {
  body?: T;
  status: number;
  type?: string;
  headers?: object;
  socket?: Socket;
};

export interface Request<BodyType = unknown, ParamsType = object, QueryType = unknown> {
  body: BodyType;
  params: ParamsType;
  query: QueryType;
  headers: object;
  [key: string]: unknown;
}

export type RequestHooks = {
  pre?: (...args: unknown[]) => unknown;
  post?: (...args: unknown[]) => Response;
};

export type ValidationResult = {
  valid: boolean;
  message?: string;
  code?: number;
  errors?: string[];
};

export type Validators = {
  request?: (...args: unknown[]) => ValidationResult;
  response?: {
    [status: number]: (...args: unknown[]) => ValidationResult;
  };
};

export type RouteOptions = {
  hooks?: RequestHooks;
  validators?: Validators;
  authorization?: (request: Request) => boolean;
};

export type RouteHandler = (...args: unknown[]) => Result;
