export type UpdateStats = {
  status: string;
  modifiedCount?: number;
  upsertedCount?: number;
  upsertedIds?: unknown[];
};

export type RemoveStats = {
  status: string;
  deletedCount?: number;
};

export type UnknownObject = { [key: string]: unknown };
export type Query = string | Array<unknown> | UnknownObject;
export type Sort = { [field: string]: number };
export type Filter = { field: string; name: string };
