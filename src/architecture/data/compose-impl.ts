import { AggregateOptions, MongoSource } from '../../storage';
import { getParams } from '../../utils';
import { Compose } from '../domain/compose';
import { Failure } from '../domain/failure';
import { QueryModel } from '../domain/query-model';
import { Repository } from '../domain/repository';
import { Result } from '../domain/result';

/**
 * @class
 */
export class ComposeImpl implements Compose {
  /**
   * @constructor
   * @param {MongoSource} source
   */
  constructor(
    protected source: MongoSource,
    protected repositories: Map<string, Repository>
  ) {}

  /**
   *
   * @param {string} name
   * @returns
   */
  public using<RepositoryType = Repository>(name: string): RepositoryType {
    return this.repositories.get(name) as RepositoryType;
  }

  /**
   *
   * @param {QueryModel} model
   * @returns {Promise<Result<Type[]>>}
   */
  public async aggregate<Type>(model: QueryModel): Promise<Result<Type[]>> {
    try {
      const { pipeline, options } = getParams(model) as {
        pipeline: Document[];
        options?: AggregateOptions;
      };
      const result = await this.source.database.aggregate(pipeline, options);
      const array = (await result.toArray()) as Type[];
      return Result.withContent(array);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
