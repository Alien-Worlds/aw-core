export type UpdateParams = { where?: unknown; options?: unknown };

export enum UpdateStatus {
  Success = 'success',
  Partial = 'partial',
  Failure = 'failure',
}

export type UpdateManyResult = {
  modifiedCount?: number;
  upsertedCount?: number;
  upsertedIds?: {
    [key: number]: unknown;
  };
};
