import { ClusterQueryModel } from './cluster-query-model';
import { Result } from './result';

export type AnyDocumentObject = { [key: string]: unknown };
export type MapFunction = (dto: unknown) => unknown;

/**
 * @abstract
 * @class
 */
export abstract class Cluster {
  public abstract count(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<number>>;
  public abstract find<Type>(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<Type[]>>;

  public abstract findOne<Type>(
    model: ClusterQueryModel | AnyDocumentObject
  ): Promise<Result<Type>>;
  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<Type[]>>}
   */
  public abstract aggregate<Type>(model: ClusterQueryModel): Promise<Result<Type[]>>;
}
