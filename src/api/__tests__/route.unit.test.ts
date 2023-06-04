import {
  setupRouteHandler,
  Route,
  GetRoute,
  PostRoute,
  PatchRoute,
  PutRoute,
  DeleteRoute,
} from '../route';

describe('setupRouteHandler', () => {
  it('should handle the route request and send a successful response', async () => {
    const route = {
      options: {
        hooks: {
          pre: jest.fn().mockReturnValue('pre-hook-result'),
          post: jest.fn().mockReturnValue({ status: 201, body: 'post-hook-body' }),
        },
        validators: {
          request: jest.fn().mockReturnValue({ valid: true }),
        },
        authorization: jest.fn().mockReturnValue(true),
      },
      handler: jest.fn().mockResolvedValue('handler-result'),
    } as any;

    const req = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    const res = {
      status: jest.fn((code: number) => res),
      send: jest.fn(),
    };

    const routeHandler = setupRouteHandler(route);

    await routeHandler(req, res);

    expect(route.options.hooks.pre).toHaveBeenCalledWith(req);
    expect(route.handler).toHaveBeenCalledWith('pre-hook-result');
    expect(route.options.hooks.post).toHaveBeenCalledWith('handler-result');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith('post-hook-body');
  });

  it('should handle the route request and run preand post hooks', async () => {
    const route = {
      options: {
        hooks: {
          pre: jest.fn().mockReturnValue('pre-hook-result'),
          post: jest.fn().mockReturnValue('post-hook-result'),
        },
      },
      handler: jest.fn(),
    } as any;

    const req = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    const res = {
      status: jest.fn((code: number) => res),
      send: jest.fn(),
    };

    const routeHandler = setupRouteHandler(route);
    await routeHandler(req, res);

    expect(route.options.hooks.pre).toHaveBeenCalledWith(req);
    expect(route.handler).toHaveBeenCalledWith('pre-hook-result');
    expect(route.options.hooks.post).toHaveBeenCalled();
  });

  it('should run validator and return 400 if request is invalid', async () => {
    const route = {
      options: {
        validators: {
          request: jest
            .fn()
            .mockReturnValue({ valid: false, code: 400, message: 'Invalid request' }),
        },
      },
      handler: jest.fn(),
    } as any;

    const req = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    const res = {
      status: jest.fn((code: number) => res),
      send: jest.fn(),
    };

    const routeHandler = setupRouteHandler(route);
    await routeHandler(req, res);

    expect(route.options.validators.request).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid request' });
  });
  
  it('should return 401 if authorization is set and it fails', async () => {
    const route = {
      options: {
        authorization: jest.fn().mockReturnValue(false),
      },
      handler: jest.fn(),
    } as any;

    const req = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    const res = {
      status: jest.fn((code: number) => res),
      send: jest.fn(),
    };

    const routeHandler = setupRouteHandler(route);
    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 500 if server fails', async () => {
    const route = {
      handler: jest.fn().mockRejectedValue(new Error('Handler error')),
    } as any;

    const req = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    const res = {
      status: jest.fn((code: number) => res),
      send: jest.fn(),
    };

    const routeHandler = setupRouteHandler(route);
    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Route', () => {
  describe('mount', () => {
    it('should mount the GET route on the server', () => {
      const server = {
        get: jest.fn(),
      };

      let route = new GetRoute('/path', jest.fn());
      Route.mount(server, route);
      expect(server.get).toHaveBeenCalledWith('/path', expect.any(Function));

      route = new GetRoute(['/path'], jest.fn());
      Route.mount(server, route);
      expect(server.get).toHaveBeenNthCalledWith(1, '/path', expect.any(Function));
    });

    it('should mount the POST route on the server', () => {
      const server = {
        post: jest.fn(),
      };

      let route = new PostRoute('/path', jest.fn());
      Route.mount(server, route);
      expect(server.post).toHaveBeenCalledWith('/path', expect.any(Function));

      route = new PostRoute(['/path'], jest.fn());
      Route.mount(server, route);
      expect(server.post).toHaveBeenNthCalledWith(1, '/path', expect.any(Function));
    });

    it('should mount the PATCH route on the server', () => {
      const server = {
        patch: jest.fn(),
      };

      let route = new PatchRoute('/path', jest.fn());
      Route.mount(server, route);
      expect(server.patch).toHaveBeenCalledWith('/path', expect.any(Function));

      route = new PatchRoute(['/path'], jest.fn());
      Route.mount(server, route);
      expect(server.patch).toHaveBeenNthCalledWith(1, '/path', expect.any(Function));
    });

    it('should mount the PUT route on the server', () => {
      const server = {
        put: jest.fn(),
      };

      let route = new PutRoute('/path', jest.fn());
      Route.mount(server, route);
      expect(server.put).toHaveBeenCalledWith('/path', expect.any(Function));

      route = new PutRoute(['/path'], jest.fn());
      Route.mount(server, route);
      expect(server.put).toHaveBeenNthCalledWith(1, '/path', expect.any(Function));
    });

    it('should mount the DELETE route on the server', () => {
      const server = {
        delete: jest.fn(),
      };

      let route = new DeleteRoute('/path', jest.fn());
      Route.mount(server, route);
      expect(server.delete).toHaveBeenCalledWith('/path', expect.any(Function));

      route = new DeleteRoute(['/path'], jest.fn());
      Route.mount(server, route);
      expect(server.delete).toHaveBeenNthCalledWith(1, '/path', expect.any(Function));
    });
  });
});

describe('GetRoute', () => {
  describe('constructor', () => {
    it('should create a new GetRoute instance', () => {
      const handler = jest.fn();

      let route = new GetRoute('/path', handler);

      expect(route.method).toBe('GET');
      expect(route.path).toBe('/path');
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();

      route = new GetRoute(['/path'], handler);

      expect(route.method).toBe('GET');
      expect(route.path).toStrictEqual(['/path']);
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();
    });
  });
});

describe('PostRoute', () => {
  describe('constructor', () => {
    it('should create a new PostRoute instance', () => {
      const handler = jest.fn();

      let route = new PostRoute('/path', handler);

      expect(route.method).toBe('POST');
      expect(route.path).toBe('/path');
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();

      route = new PostRoute(['/path'], handler);

      expect(route.method).toBe('POST');
      expect(route.path).toStrictEqual(['/path']);
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();
    });
  });
});

describe('PatchRoute', () => {
  describe('constructor', () => {
    it('should create a new PatchRoute instance', () => {
      const handler = jest.fn();

      let route = new PatchRoute('/path', handler);

      expect(route.method).toBe('PATCH');
      expect(route.path).toBe('/path');
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();

      route = new PatchRoute(['/path'], handler);

      expect(route.method).toBe('PATCH');
      expect(route.path).toStrictEqual(['/path']);
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();
    });
  });
});

describe('PutRoute', () => {
  describe('constructor', () => {
    it('should create a new PutRoute instance', () => {
      const handler = jest.fn();

      let route = new PutRoute('/path', handler);

      expect(route.method).toBe('PUT');
      expect(route.path).toBe('/path');
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();

      route = new PutRoute(['/path'], handler);

      expect(route.method).toBe('PUT');
      expect(route.path).toStrictEqual(['/path']);
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();
    });
  });
});

describe('DeleteRoute', () => {
  describe('constructor', () => {
    it('should create a new DeleteRoute instance', () => {
      const handler = jest.fn();

      let route = new DeleteRoute('/path', handler);

      expect(route.method).toBe('DELETE');
      expect(route.path).toBe('/path');
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();

      route = new DeleteRoute(['/path'], handler);

      expect(route.method).toBe('DELETE');
      expect(route.path).toStrictEqual(['/path']);
      expect(route.handler).toBe(handler);
      expect(route.options).toBeUndefined();
    });
  });
});
