import {
  AggregateOptions,
  CountDocumentsOptions,
  DeleteOptions,
  Filter,
  FindOptions,
  UpdateOptions,
} from 'mongodb';

export type CollectionOptions = {
  skipIndexCheck?: boolean;
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

export type UpdateManyResult = {
  modifiedCount?: number;
  upsertedCount?: number;
  upsertedIds?: {
    [key: number]: unknown;
  };
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
