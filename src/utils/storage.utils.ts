import { QueryModel } from '../architecture';

const specials = [
  '$currentDate',
  '$inc',
  '$min',
  '$max',
  '$mul',
  '$rename',
  '$set',
  '$setOnInsert',
  '$unset',
  '$addToSet',
  '$pop',
  '$pull',
  '$push',
  '$pullAll',
  '$bit',
];

export const isQueryModel = (value: unknown): value is QueryModel =>
  (<QueryModel>value).toQueryParams !== undefined;

export const containsSpecialKeys = (data: unknown): boolean => {
  try {
    const keys = Object.keys(data);

    for (const key of keys) {
      if (specials.includes(key)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const getParams = (data?: unknown): object => {
  if (isQueryModel(data)) {
    return data.toQueryParams() as object;
  }

  if (typeof data === 'object') {
    return data;
  }

  return {};
};
