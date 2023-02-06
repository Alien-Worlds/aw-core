export abstract class ClusterQueryModel<T = unknown> {
  public abstract collections?: string[];
  public abstract toQueryParams(...args: unknown[]): T;
}
