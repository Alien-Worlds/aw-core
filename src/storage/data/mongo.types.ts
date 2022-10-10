import { AggregateOptions, DeleteOptions, Filter, FindOptions } from 'mongodb';

export type MongoAggregateParams = {
  pipeline: object[];
  options?: AggregateOptions;
};

export type MongoFindQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: FindOptions;
};

export type MongoDeleteQueryParams<T = unknown> = {
  filter: Filter<T>;
  options?: DeleteOptions;
};
