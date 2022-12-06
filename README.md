# api-core

A set of classes, functions used in both API and history tools. Designed not to duplicate the same code in different projects if there is no need to do so.

## Components

### IOC

Our packages use `inversify`, which is lightweight inversion of control container. To avoid conflicts, every package using `api-core` and IOC should use Inversfy. However, it is not necessary to import yet another dpenedency in your package because `api-core` exports **all** Inversify components.

### API

Contains elements (types, errors, enums and classes) used in the API. The most important are the `Route` classes which are used as the basis for creating specific routes in the API code.

| Name            |    Type     |     Layer     | Description                                                                                     |
| :-------------- | :---------: | :-----------: | ----------------------------------------------------------------------------------------------- |
| `Route`         | **_class_** | _application_ | Base class used for specific types of routes `{ method, path, handler, options? }`              |
| `GetRoute`      | **_class_** | _application_ | Route class with a defined type `GET`                                                           |
| `PostRoute`     | **_class_** | _application_ | Route class with a defined type `POST`                                                          |
| `PutRoute`      | **_class_** | _application_ | Route class with a defined type `PUT`                                                           |
| `DeleteRoute`   | **_class_** | _application_ | Route class with a defined type `DELETE`                                                        |
| `RequestMethod` | **_enum_**  | _application_ | `POST`, `PUT`, `GET`, `DELETE`                                                                  |
| `RequestError`  | **_error_** | _application_ | Request error contains basic information about the failure (status, message and details object) |
| `Request`       | **_type_**  | _application_ | Basic request type (independent of the selected web framework)                                  |
| `Response`      | **_type_**  | _application_ | Basic response type (independent of the selected web framework)                                 |
| `RouteOptions`  | **_type_**  | _application_ | Additional route options where hooks and validatorscan be specified                             |
| `RequestHooks`  | **_type_**  | _application_ | Functions (`pre`, `post`) that run before and after the handler execution                       |
| `Validators`    | **_type_**  | _application_ | Second route option which specifies validators for the request and response                     |
| `RouteHandler`  | **_type_**  | _application_ | The function assigned to the endpoint that must return a `Result`                               |

### Architecture

| Name         |    Type     |     Layer     | Description                                                                                                                                                                              |
| :----------- | :---------: | :-----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionSource`    | **_class_** |   _data_    |                     |
| `Mapper`    | **_class_** |   _data_    |                     |
| `RepositoryImpl`    | **_class_** |   _data_    |                     |
| `UpdateStatus`, `UpdateManyResult`    | **_type_** |   _data_    |                     |
| `Repository`    | **_class_** |   _domain_    |                     |
| `UseCase`    | **_class_** |   _domain_    | Use cases orchestrate the flow of data to and from the entities, and direct those entities to use their Critical Business Rules to achieve the goals of the use case.                    |
| `Result`     | **_class_** |   _domain_    | Result represents a value of two possible data types. A result is either a defined content type or a Failure.                                                                            |
| `Failure`    | **_class_** |   _domain_    | Failure represents one of the Result data types. Failure contains an error object                                                                                                        |
| `QueryModel` | **_class_** | _domain/data_ | Defines a data model which is on top of the specific data base query. Contains `toQueryParams` method which returns the parameters needed to execute the query in the specified database |

### RPC

| Name                              |    Type     |  Layer   |
| :-------------------------------- | :---------: | :------: |
| `EosRpcSource`                    | **_class_** |  _data_  |
| `EosJsRpcSource`                  | **_class_** |  _data_  |
| `SmartContractDataNotFoundError`  | **_error_** | _domain_ |

### Storage

| Name                       |      Type      |  Layer   |
| :------------------------- | :------------: | :------: |
| `CollectionBigQuerySource` |  **_class_**   |  _data_  |
| `CollectionMongoSource`    |  **_class_**   |  _data_  |
| `MongoSource`              |  **_class_**   |  _data_  |
| `MongoFindQueryParams`     |   **_type_**   | _domain_ |
| `MongoAggregateParams`     |   **_type_**   | _domain_ |
| `connectMongo`             | **_function_** |  _data_  |
| `buildSqlQuery`            | **_function_** |  _data_  |
| `DataSourceBulkWriteError` |  **_error_**   | _domain_ |
| `DataSourceOperationError` |  **_error_**   | _domain_ |
| `InsertManyError`          |  **_error_**   | _domain_ |
| `InsertError`              |  **_error_**   | _domain_ |
| `InsertOnceError`          |  **_error_**   | _domain_ |
| `EntityAlreadyExistsError` |  **_error_**   | _domain_ |
| `EntityNotFoundError`      |  **_error_**   | _domain_ |
| `UpdateResult`             |   **_enum_**   | _domain_ |
| `SqlQueryType`             |   **_enum_**   | _domain_ |

## Usage

To use these components in your code, add this package as a dependency using your Node package manager

```
npm add @alien-worlds/api-core
```

## Deployment

If you want to release a new version of this package, just run `deploy.sh` from the main project folder.

```sh
# patches version by default
sh scripts/deploy.sh

# Optionally, you can specify the version or what kind of update is (major|minor|patch)
# e.g.
sh scripts/deploy.sh 1.2.3
# or
sh scripts/deploy.sh major

```

This script will:

- start the typeScript compiler
- pull latest changes from the repository
- bump the version in the `package.json` file
- create a commit and push it to the repository
- publish the new version to the registry (if all the previous steps have been completed successfully)

**Before running the script, be sure that you have a clean situation and the latest changes from the repository so that there are no conflicts**
