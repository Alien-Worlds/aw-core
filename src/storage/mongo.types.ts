import {
  AggregateOptions,
  CountDocumentsOptions,
  DeleteOptions,
  Filter,
  FindOptions,
  IndexDescription,
  UpdateOptions,
} from 'mongodb';

export type CollectionOptions = {
  indexes: IndexDescription[];
};

export type MongoAggregateParams = {
  pipeline: object[];
  options?: AggregateOptions;
};

export type MongoFindQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: FindOptions;
};

export type MongoUpdateQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: UpdateOptions;
};

export type MongoCountQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: CountDocumentsOptions;
};

export type MongoDeleteQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: DeleteOptions;
};

export * from 'mongodb';
