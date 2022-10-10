import { QueryModel } from '../architecture/domain/query-model';

export const isQueryModel = (value: unknown): value is QueryModel =>
  (<QueryModel>value).toQueryParams !== undefined;
