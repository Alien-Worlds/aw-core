# api-core

A set of classes, functions used in both API and history tools. Designed not to duplicate the same code in different projects if there is no need to do so.

## Components
### API

Contains elements (types, errors, enums and classes) used in the API. The most important are the `Route` classes which are used as the basis for creating specific routes in the API code.

|  Name |  Type | Description  |
|:--|:-:|---|
|  Route | `class`  | Base class used for specific types of routes `{ method, path, handler, options? }` |
|  GetRoute | `class`  | Route class with a defined type `GET` |
|  PostRoute | `class`  |  Route class with a defined type `POST` |
|  PutRoute | `class`  | Route class with a defined type `PUT`  |
|  DeleteRoute | `class`  |  Route class with a defined type `DELETE` |
|  RequestMethod | `enum`  |  `POST`, `PUT`, `GET`, `DELETE` |
|  RequestError | `error`  | Request error contains basic information about the failure (status, message and details object)  |
|  Request | `type`  |  Basic request type (independent of the selected web framework) |
|  Response | `type`  | Basic response type (independent of the selected web framework)  |
|  RouteOptions | `type`  | Additional route options where hooks and validatorscan be specified |
|  RequestHooks | `type`  | Functions (`pre`, `post`) that run before and after the handler execution  |
|  Validators | `type`  |  Second route option which specifies validators for the request and response |
|  RouteHandler | `type`  | The function assigned to the endpoint that must return a `Result`  |

### Architecture

|  Name |  Type | Description  |
|:--|:-:|---|
|  Use Case | `class` | |
|  Result | `class` |  |
|  Failure | `class`  |   |
|  QueryModel | `class`  |  |

### Messaging

|  Name |  Type | Description  |
|:--|:-:|---|
|  Message entity | `class` | |
|  Message repository | `class` |  |
|  Messaging AMQ data source | `class`  |  |
|  ConnectionState | `enum`  |   |
|  MessageDto | `type`  | `Amq.Message`  |
|  wait | `function`  | sleep function  |
|  InvalidMessageQueueError | `error`  |   |
|  MessageKeyAlreadyTakenError | `error`  |   |
|  MessageNotFoundError | `error`  |   |
|  UndefinedMessageRepositoryError | `error`  |   |

### RPC

|  Name |  Type | Description  |
|:--|:-:|---|
|  EosRpc data source | `class` |  |
|  Smart Contract repository | `class`  |  |
|  SmartContractDataNotFoundError | `error`  |   |
|  MessageKeyAlreadyTakenError | `error`  |   |
|  MessageNotFoundError | `error`  |   |
|  UndefinedMessageRepositoryError | `error`  |   |

### Storage

|  Name |  Type | Description  |
|:--|:-:|---|
|  CollectionMongoSource | `class` | |
|  MongoSource | `class` | |
|  MongoFindQueryParams | `type`  |   |
|  MongoAggregateParams | `type`  |  |
|  connectMongo | `function`  |   |
|  DataSourceBulkWriteError | `error`  |   |
|  DataSourceOperationError | `error`  |   |
|  InsertManyError | `error`  |   |
|  InsertError | `error`  |   |

### Workers

|  Name |  Type | Description  |
|:--|:-:|---|
|  Process | `class` | |
|  WorkerMessage | `class` | |
|  WorkerOrchestrator | `class` | |
|  WorkerMessageHandler | `type`  |   |
|  WorkerMessageOptions | `type`  |  |
|  WorkerMessageType | `enum`  |  |

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
- bump the version in the `package.json` file
- create a commit and push it to the repository
- publish the new version to the registry (if all the previous steps have been completed successfully)

__Before running the script, be sure that you have a clean situation and the latest changes from the repository so that there are no conflicts__

