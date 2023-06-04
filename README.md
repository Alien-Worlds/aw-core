# Alien Worlds API Core

Alien Worlds API Core is a comprehensive TypeScript/Node.js package designed to provide a solid infrastructure for building APIs and history tools for the Alien Worlds project. The package is organized into several modules that include API building, a clean architectural structure, blockchain interactions, configuration management, and utility functions. Additionally, it employs Inversify for inversion of control (IoC) to facilitate efficient dependency management.

## Table of Contents

- [Installation](#installation)
- [IoC](#ioc)
- [API](#api)
- [Architecture](#architecture)
- [Blockchain](#blockchain)
- [Config](#config)
- [Utils](#utils)
- [Contributing](#contributing)
- [License](#license)

## Installation

```sh
yarn add @alien-worlds/api-core
```

## IoC

Inversion of Control (IoC) is implemented using Inversify, a powerful and lightweight inversion of control container for JavaScript and Node.js apps powered by TypeScript. IoC promotes code modularity, making the system more flexible, maintainable, and scalable.

## API

This module comprises the core components necessary for creating APIs. It consists of enumerations, error types, route class, and other types that allow efficient API design.

### `setupRouteHandler(route)`

This function sets up the route handler function for a given route. It takes a `route` object as input and returns a promise that resolves to the route handler function. The route handler function is responsible for handling incoming requests and generating appropriate responses based on the provided route configuration.

The `setupRouteHandler` function supports any web framework and can be used in conjunction with the `Route` class to define routes. It provides flexibility and extensibility, allowing developers to customize the request handling logic by specifying hooks, validators, and authorization functions within the route configuration.

### `Route` Class

The `Route` class is a generic class that represents a route in your web application. It provides a flexible and modular approach to define routes and handle incoming requests. Developers can extend the `Route` class and use derived classes such as `GetRoute`, `PostRoute`, `PatchRoute`, `PutRoute`, and `DeleteRoute` to define routes for different HTTP methods.

The `Route` class allows you to specify the HTTP method, path, handler function, and optional configuration options for each route. It supports the use of hooks, validators, and authorization functions to customize the request handling process. The class is designed to be compatible with any web framework you choose to use, making it a versatile choice for building APIs or handling server-side routes.

By leveraging the `Route` class and its derived classes, developers can create a clear and structured API for their web application, improving code organization and maintainability.

```java
// An example of using the GetRoute class

export class ListPlanetsRoute extends GetRoute {
  public static create(handler: RouteHandler, config: PlanetsApiConfig) {
    return new ListPlanetsRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: PlanetsApiConfig) {
    super(`/${config.version}/planets/list`, handler, {
      hooks: {
        pre: ListPlanetsInput.fromRequest,
        post: (output: ListPlanetsOutput) => output.toResponse(),
      },
    });
  }
}
```

## Architecture

The architecture module, divided into data and domain layers, follows clean architecture principles. Adopting this approach enhances the code's flexibility, maintainability, and testability. It allows for independent and reusable code components, ensuring that code style remains consistent across different contributors.

The clean architecture paradigm also promotes separation of concerns by dividing the code into layers. The use of this design pattern facilitates the ability to change one aspect of the system without affecting others. This is due to the decoupling of the software into independent layers, thereby reducing the complexity of the codebase, increasing readability, and improving overall code quality.


### Data Layer

The data layer contains base classes and types for data layer components such as:

- **DataSource**: Represents a general interface for the data sources in the application.
- **Mapper**: Converts between the EntityType and the DocumentType.
- **QueryBuilders**: Collection of query builders for different types of operations (find, count, update, remove, and aggregate).
- **RepositoryImpl**: A generic repository for managing database interactions.

### Domain Layer

The domain layer consists of basic components and types such as:

- **Entity**: Core representation of an object in the system.
- **QueryBuilder and QueryParams**: Abstract QueryBuilder class and parameters for various queries (FindParams, CountParams, AggregationParams, RemoveParams, UpdateParams).
- **Failure**: Represents a failure as a result of an error in executing a use case or repository operation.
- **ReadOnlyRepository and Repository**: Abstract classes defining read-only and mutable repository methods.
- **Result**: Represents the result of executing a use case or repository operation. It can return either a Failure object or the typed content.
- **UseCase**: Abstract UseCase class for encapsulating business logic.
- **Where**: A class used to build 'Where' clauses. Used to build database queries within query builders.

## Blockchain

The blockchain component is divided into data and domain layers. It contains the necessary types and components to interact with the blockchain.

### Data Layer

Key components include:

- **RpcSource**: Abstraction for the RPC connection. It contains methods to retrieve table rows and contract stats.
- **EosRpcSource**: Source for making RPC requests to an EOS blockchain.
- **SmartContractServiceImpl**: Implements the SmartContractService interface, providing implementation for interacting with smart contracts.

### Domain Layer

The domain layer contains:

- Entities like **Action**, **ContractAction**, **ContractDelta**, and **ContractUnknownDataEntity** to represent different blockchain transaction aspects.
- **SmartContractService** interface with one method getStats. The concrete service should implement methods to retrieve desired table rows of the contract.
- Types related to the smart contract components.

## Config

The config module contains utilities for working with environment variables and `.env` files:

- **ConfigVars**: Provides access to environment variables and values from a .env file.
- **readEnvFile**: Reads and parses the contents of an .env file and returns an object representing the key-value pairs.
- **parseEnvFile**: Parses the contents of an .env file buffer or string and returns an object representing the key-value pairs.

## Utils

The utility component provides a set of functions that assist in various tasks, including:

- **wait**: Suspends execution of the current process for a given number of milliseconds.
- **parseDateToMs**: Parses a date string into milliseconds.
- **removeUndefinedProperties**: Removes undefined properties and empty objects, useful for creating DTOs to send to a data source.
- **parseToBigInt & parseUint8ArrayToBigInt**: Functions for parsing values into BigInt.

## Contributing

We encourage contributions from the community. If you have suggestions or features you'd like to see in the api-core package, please open an issue. For pull requests, ensure your changes are well documented and include tests where possible.

## License

Alien Worlds API Core is [MIT licensed](./LICENSE).

> Note to the maintainer: This Readme assumes an MIT License. If the license is different, please change it accordingly.
