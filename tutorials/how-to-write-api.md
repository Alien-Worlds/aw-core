# How to write API

In this tutorial, we will guide you through creating an API using a predefined template structure, covering everything from setting up the initial package.json file to the final architecture of the code.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [API File Structure](#api-file-structure)
3. [Root index.ts](#root-indexts)
4. [api.ts](#apits)
5. [routes.ts](#routests)
6. [Implementing Endpoint](#implementing-endpoint)
7. [IOC Config](#ioc-config)
8. [Conclusion](#conclusion)

## Initial Setup

- Visit [Starter Kit](https://github.com/Alien-Worlds/api-starter-kit) and download the template repository.
- Customize the `package.json` file to your needs:
  - You can add your preferred web framework if the one provided in the template doesn't suit you.
  - Set up your desired database. By default, MongoDB is used.
  - Add any other dependencies you need.

## API File Structure

The API's file structure should be organized as follows:
```
root/
- endpoints/
  - <endpoint_name>
    - data/
      - data-sources/
      - repositories/
      - mappers/
      - types/
    - domain/
      - entities/
      - models/
      - use-cases/
      - repositories/
      - services/
      - controller.ts
  - routes/
  - ioc.config.ts
- config/
- api.ts
- routes.ts
- index.ts
```

## Root index.ts

The root index is the entry point for the API. In this file, we establish the configuration, dependencies, and all routes that end up running the API itself.

```typescript
import 'reflect-metadata'; // this line is important! It is required for the ioc to run.

import { Container } from '@alien-worlds/api-core';
import { YourApi } from './api';
import { setupDependencies } from './endpoints/Your';
import { mountRoutes } from './routes';
import { buildConfig } from './config/config';

export const startApi = async () => {
  const config = buildConfig();
  const container = new Container(); // ioc container

  await setupDependencies(config, container);

  const api = new YourApi(config);

  mountRoutes(api, container);

  return api.start();
};

startApi();

```

## api.ts

api.ts serves as a wrapper for the chosen web framework (in our case it is Express). This file should contain initialization code and a crucial `framework` getter, used by `Routes` and other internal components.

```typescript
import { log } from '@alien-worlds/api-core';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { YourApiConfig } from './config/config.types';

export class YourApi {
  private app: Express;

  constructor(private config: YourApiConfig) {
    this.app = express();
    this.app.use(bodyParser.json());
  }

  public async start() {
    const { config: { port } } = this;
    this.app.listen(port, () => {
      log(`Server is running at http://localhost:${port}`);
    });
  }

  public get framework(): Express {
    return this.app;
  }
}
```

## routes.ts

This file contains code for attaching routes to the web framework. Here, we create `Route` instances and assign a controller method to each route, ensuring the rest of the code remains web framework agnostic.

```typescript
import { Container, Route } from '@alien-worlds/api-core';
import { YourEndpointApi } from './api';
import {
YourEndpointController,
ListYourEndpointRoute,
} from './endpoints/your-endpoint';

export const mountRoutes = (api: YourEndpointApi, container: Container) => {
  const yourEndpointController = container.get<YourEndpointController>(YourEndpointController.Token);

  Route.mount(
    api.framework,
    ListYourEndpointRoute.create(yourEndpointController.list.bind(YourEndpointController))
  );
  ...
};
```

## Implementing Endpoint

The file structure includes routes, data, domain folders, etc. Let's start with adding routes to an endpoint.

### Adding Routes to Endpoint

One endpoint, which we can refer to as a feature, can have multiple routes corresponding to that feature. Each route is a file that extends a Method route class like GetRoute, PostRoute, etc. Each route should contain a static method create and a private constructor to simplify its creation. Constructor arguments include the route path, handler, and route options.

```typescript
import { GetRoute, RouteHandler } from '@alien-worlds/api-core';
import { ListYourEndpointInput } from '../domain/models/list-your-endpoint.input';
import { ListYourEndpointOutput } from '../domain/models/list-your-endpoint.output';

export class ListYourEndpointRoute extends GetRoute {
  public static create(handler: RouteHandler) {
    return new ListYourEndpointRoute(handler);
  }

  private constructor(handler: RouteHandler) {
    super('/v1/your-endpoint/:some/:params', handler, {
      hooks: {
        pre: ListYourEndpointInput.fromRequest,
        post: (output: ListYourEndpointOutput) => output.toResponse(),
      },
      authorization: (request) => {
        if (!config.secretKey) {
          return true;
        }
        // ... eg. jwt.verify implementation
        return valid;
      },
      validators: {
        request: (request: Request) => {
          // ... some validation
          return {
            valid,
            message: !valid ? 'bad request' : '',
            errors: ['wallet_id is required'],
          };
        },
      },
    });
  }
}
```
In the example above, the authorization and validators options are not mandatory, but they are provided here as an example.
When you define your endpoint, you can mount it as shown in one of the above snippets *(routes.ts)*.

### Adding Controller

Endpoint controller holds methods for each route. It should be source-agnostic, as you might extend your API for different controller sources.

```typescript
import { Result, injectable } from '@alien-worlds/api-core';
import { ListYourEndpointOutput } from './models/list-your-endpoint.output';
import { ListYourEndpointInput } from './models/list-your-endpoint.input';

@injectable()
export class YourEndpointController {
  // We add static string "Token" label in our injectbale components for IoC binding...
  public static Token = 'YOUR_CONTROLLER';

  // ...in the constructor you have an example of using Token to inject other component
  constructor(
    @inject(ListYourEndpointUseCase.Token)
    private listYourEndpointUseCase: ListYourEndpointUseCase
  ){}

  public async YourEndpointRouteMethod(model: ListYourEndpointInput): Promise<ListYourEndpointOutput> {
    // Here you can add some logic to choose the right use case but try 
    // to limit yourself to just that, the rest should be in the use case. 
    // Try to not import repositories/services directly in the controller.
    const result = await this.listYourEndpointUseCase.execute(model);

    // Each method must return the output
    return ListYourEndpointOutput.create(result);
  }
}
```

## IOC Config

We will not describe every component of the endpoint here, please take a look at the template repository and see the implementation of the data source, mapper, repository, etc.
It's crucial to take a moment to describe the IOC (Inversion of Control) config, placed in the endpoints folder. This config contains all initialization code required to build database clients and perform all async work necessary to make all components functional.

```typescript
export const setupDependencies = async (
  config: YourApiConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);

  // ... other async tasks

  container.bind<YourEndpointApiConfig>('CONFIG').toConstantValue(config);

  // your endpoint
  container
    .bind<ListYourEndpointUseCase>(ListYourEndpointUseCase.Token)
    .to(ListYourEndpointUseCase);

  // ... rest of the bindings
};
```

The `setupDependencies` function is called in the root index.ts just before creating instance of the api.


## Conclusion

Following these guidelines helps maintain consistent code across all our repositories, making it easier for developers to navigate each repo as they all share the same

structure, but with different business logic. To further streamline this process, we have a code generator that maintains this structure and boost your work. Check out the [AlienGen](https://github.com/Alien-Worlds/aliengen) repository for more details.
