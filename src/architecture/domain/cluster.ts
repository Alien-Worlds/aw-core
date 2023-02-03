import { QueryModel } from './query-model';
import { Repository } from './repository';
import { Result } from './result';

/**
 * @abstract
 * @class
 */
export abstract class Cluster {
  public abstract using<RepositoryType = Repository>(name: string): RepositoryType;
  public abstract aggregate<Type>(model: QueryModel): Promise<Result<Type[]>>;
}
