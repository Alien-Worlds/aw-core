import { UpdateFilter } from 'mongodb';
import { QueryModel } from '../architecture';

export const isQueryModel = (value: unknown): value is QueryModel =>
  (<QueryModel>value).toQueryParams !== undefined;

export const isUpdateFilter = <T>(value: unknown): value is UpdateFilter<T> => {
  return value['$currentDate'] ||
    value['$inc'] ||
    value['$min'] ||
    value['$max'] ||
    value['$mul'] ||
    value['$rename'] ||
    value['$set'] ||
    value['$setOnInsert'] ||
    value['$unset'] ||
    value['$addToSet'] ||
    value['$pop'] ||
    value['$pull'] ||
    value['$push'] ||
    value['$pullAll'] ||
    value['$bit']
    ? true
    : false;
};
