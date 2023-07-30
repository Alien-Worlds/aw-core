import { log } from '../utils';
import { RequestMethod } from './api.enums';
import { RouteHandler, RouteOptions, Request, Response } from './api.types';

type BasicResponseType = {
  status(code: number | string): BasicResponseType;
  send(body: unknown): BasicResponseType;
  [key: string]: unknown;
};

type BasicRequestType = {
  post(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
  put(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
  patch(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
  get(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
  delete(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
};

/**
 * Sets up the route handler function for a given route.
 * @template RequestType - Type of the request object.
 * @template ResponseType - Type of the response object.
 * @param {Route} route - The route for which the handler function is being set up.
 * @returns {Promise<(req: RequestType, res: ResponseType) => Promise<void>>} The route handler function.
 */
export const setupRouteHandler =
  <RequestType = BasicRequestType, ResponseType = BasicResponseType>(route: Route) =>
  async (req: RequestType, res: ResponseType) => {
    const { hooks, validators, authorization, io } = route.options || {};

    if (authorization) {
      const auth = authorization(<Request>req);

      if (auth === false) {
        return (<BasicResponseType>res).status(401).send('Unauthorized');
      }
    }

    if (validators?.request) {
      const { valid, message, code, errors } = validators.request(req);

      if (!valid) {
        return (<BasicResponseType>res).status(code || 400).send({
          message,
          errors,
        });
      }
    }

    try {
      let args;
      let input;
      let response: Response = { body: 'OK', status: 200 };

      if (hooks?.pre) {
        args = hooks.pre(req);
      }

      if (io?.fromRequest) {
        io.fromRequest(req, args);
      }

      const output = await route.handler(input);

      if (hooks?.post) {
        hooks.post(output);
      }

      if (io?.toResponse) {
        response = io.toResponse(output);
      }

      (<BasicResponseType>res).status(response.status).send(response.body);
    } catch (error) {
      log(error);
      (<BasicResponseType>res).status(500).send(error);
    }
  };

/**
 * Represents a route in the web framework.
 */
export class Route {
  /**
   * Mounts the route on the specified server.
   * @template ServerType, RequestType, ResponseType
   * @param {ServerType} app - The server instance to mount the route on.
   * @param {Route} route - The route instance to be mounted.
   * @returns {ServerType} The modified server instance with the mounted route.
   */
  public static mount<
    ServerType,
    RequestType = BasicRequestType,
    ResponseType = BasicResponseType
  >(app: ServerType, route: Route): ServerType {
    const routeHandler = setupRouteHandler<RequestType, ResponseType>(route);

    switch (route.method) {
      case 'POST': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).post(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).post(
            <string>route.path,

            routeHandler
          );
        }
        break;
      }
      case 'PATCH': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).patch(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).patch(
            <string>route.path,

            routeHandler
          );
        }
        break;
      }
      case 'GET': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).get(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).get(<string>route.path, routeHandler);
        }
        break;
      }
      case 'PUT': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).put(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).put(<string>route.path, routeHandler);
        }
        break;
      }
      case 'DELETE': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).delete(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).delete(
            <string>route.path,

            routeHandler
          );
        }
        break;
      }
      default: {
        // TODO: fix it
        throw new Error('Method not defined');
      }
    }

    return app;
  }

  /**
   * Creates a new Route instance.
   * @param {RequestMethod} method - The HTTP request method of the route.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly method: RequestMethod,
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {}
}

/**
 * Represents a GET route in the web framework.
 */
export class GetRoute extends Route {
  /**
   * Creates a new GetRoute instance.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Get, path, handler, options);
  }
}

/**
 * Represents a POST route in the web framework.
 */
export class PostRoute extends Route {
  /**
   * Creates a new PostRoute instance.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Post, path, handler, options);
  }
}

/**
 * Represents a PATCH route in the web framework.
 */
export class PatchRoute extends Route {
  /**
   * Creates a new PatchRoute instance.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Patch, path, handler, options);
  }
}

/**
 * Represents a PUT route in the web framework.
 */
export class PutRoute extends Route {
  /**
   * Creates a new PutRoute instance.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Put, path, handler, options);
  }
}

/**
 * Represents a DELETE route in the web framework.
 */
export class DeleteRoute extends Route {
  /**
   * Creates a new DeleteRoute instance.
   * @param {string | string[]} path - The path or paths of the route.
   * @param {RouteHandler} handler - The handler function for the route.
   * @param {RouteOptions} [options] - Optional route configuration options.
   */
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Delete, path, handler, options);
  }
}
