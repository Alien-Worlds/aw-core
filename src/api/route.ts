import { RouteHandler, RouteOptions } from './api.types';

import { RequestMethod } from './api.enums';

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
  get(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
  delete(
    path: string | string[],
    handler: (...args: unknown[]) => Promise<BasicResponseType>
  );
};

export class Route {
  public static mount<
    ServerType,
    RequestType = BasicRequestType,
    ResponseType = BasicResponseType
  >(app: ServerType, route: Route): ServerType {
    /**
     *
     * @param {RequestType} req
     * @param {ResponseType} res
     */
    const routeHandler = async (req: RequestType, res: ResponseType) => {
      const { hooks, validators } = route.options || {};

      if (validators?.request) {
        const { valid, message, code } = validators.request(req);

        if (!valid) {
          return (<BasicResponseType>res).status(code || 400).send(message);
        }
      }

      try {
        let args: unknown;

        if (hooks.pre) {
          args = hooks.pre(req);
        }

        const result = await route.handler(args);

        if (hooks.post) {
          const { status, body } = hooks.post(result);
          (<BasicResponseType>res).status(status).send(body);
        } else {
          (<BasicResponseType>res).status(200).send(result);
        }
      } catch (error) {
        (<BasicResponseType>res).status(500).send(error);
      }
    };

    switch (route.method) {
      case 'POST': {
        if (Array.isArray(route.path)) {
          route.path.forEach(path => {
            (<BasicRequestType>app).post(path, routeHandler);
          });
        } else {
          (<BasicRequestType>app).post(<string>route.path, routeHandler);
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
          (<BasicRequestType>app).delete(<string>route.path, routeHandler);
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
  constructor(
    public readonly method: RequestMethod,
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {}
}

export class GetRoute extends Route {
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Get, path, handler, options);
  }
}

export class PostRoute extends Route {
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Post, path, handler, options);
  }
}

export class PutRoute extends Route {
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Put, path, handler, options);
  }
}

export class DeleteRoute extends Route {
  constructor(
    public readonly path: string | string[],
    public readonly handler: RouteHandler,
    public readonly options?: RouteOptions
  ) {
    super(RequestMethod.Delete, path, handler, options);
  }
}
