import { Failure } from '../domain/failure';
import { QueryBuilder } from '../domain/queries/query-builder';
import { Repository } from '../domain/repository';
import { Result } from '../domain/result';
import { DataSource } from './data.source';
import { Mapper } from './mapper';
import { UpdateStats, RemoveStats, Query } from '../domain/types';
import { AggregationParams } from '../domain/queries/params/aggregation-params';
import { CountParams } from '../domain/queries/params/count-params';
import { FindParams, RemoveParams, UpdateParams } from '../domain/queries';
import { QueryBuilders } from './query-builders';

/**
 * @class
 * Represents a generic repository for managing database interactions.
 *
 * Note: This repository should be used when we do not want to provide methods to modify the contents of collections in the database.
 */
export class RepositoryImpl<EntityType, DocumentType>
  implements Repository<EntityType, DocumentType>
{
  /**
   * @constructor
   * Creates a new RepositoryImpl instance.
   *
   * @param {DataSource<DocumentType>} source The DataSource used for database operations.
   * @param {Mapper<EntityType, DocumentType>} mapper The Mapper used for entity-document transformations.
   * @param {QueryBuilders} queryBuilders The QueryBuilders used for building query objects.
   */
  constructor(
    protected source: DataSource<DocumentType>,
    protected mapper: Mapper<EntityType, DocumentType>,
    protected queryBuilders: QueryBuilders
  ) {}

  /**
   * Executes an aggregation operation on the data source.
   *
   * Note: This method should be marked as protected. If custom aggregation operations are required,
   * a new repository should be created extending this one and implementing the custom methods.
   * Inside these custom methods, this aggregate method can be used.
   *
   * @param {AggregationParams | QueryBuilder} paramsOrBuilder The parameters or QueryBuilder for the aggregation operation.
   * @param {Mapper<ResultType, AggregationType>?} mapper The Mapper used for ResultType-AggregationType transformations (optional).
   *
   * @returns {Promise<Result<ResultType, Error>>} The result of the aggregation operation.
   */
  protected async aggregate<
    ResultType = EntityType | EntityType[],
    AggregationType = DocumentType
  >(
    paramsOrBuilder: AggregationParams | QueryBuilder,
    mapper?: Mapper<ResultType, AggregationType>
  ): Promise<Result<ResultType, Error>> {
    try {
      let query: Query;

      if (paramsOrBuilder instanceof AggregationParams) {
        query = this.queryBuilders.buildAggregationQuery(paramsOrBuilder);
      } else {
        query = paramsOrBuilder.build();
      }

      const aggregation = await this.source.aggregate(query);
      const conversionMapper = mapper || this.mapper;

      if (Array.isArray(aggregation)) {
        return Result.withContent(
          aggregation.map(document =>
            conversionMapper.toEntity(<AggregationType & DocumentType>document)
          ) as ResultType
        );
      }

      return Result.withContent(conversionMapper.toEntity(aggregation) as ResultType);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Updates entities in the data source.
   *
   * @param {UpdateParams<Partial<EntityType>> | QueryBuilder} paramsOrBuilder The parameters or QueryBuilder for the update operation.
   *
   * @returns {Promise<Result<UpdateStats, Error>>} The result of the update operation, containing the update statistics or an error.
   */
  public async update(
    paramsOrBuilder: UpdateParams<Partial<EntityType>> | QueryBuilder
  ): Promise<Result<UpdateStats, Error>> {
    try {
      let query: Query;

      if (paramsOrBuilder instanceof UpdateParams) {
        const { updates, where, methods } = paramsOrBuilder;
        const documents = updates.map(update =>
          this.mapper.fromEntity(update as EntityType)
        );

        query = this.queryBuilders.buildUpdateQuery(documents, where, methods);
      } else {
        query = paramsOrBuilder.build();
      }

      const stats = await this.source.update(query);

      return Result.withContent(stats);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Adds entities to the data source.
   *
   * @param {EntityType[]} entities The entities to be added.
   *
   * @returns {Promise<Result<EntityType[], Error>>} The result of the add operation, containing the added entities or an error.
   */
  public async add(entities: EntityType[]): Promise<Result<EntityType[], Error>> {
    try {
      const documents = entities.map(entity => this.mapper.fromEntity(entity));
      const inserted = await this.source.insert(documents);
      const newEntities = inserted.map(document => this.mapper.toEntity(document));

      return Result.withContent(newEntities);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Removes entities from the data source.
   *
   * @param {RemoveParams | QueryBuilder} paramsOrBuilder The parameters or QueryBuilder for the remove operation.
   *
   * @returns {Promise<Result<RemoveStats, Error>>} The result of the remove operation, containing the removal statistics or an error.
   */
  public async remove(
    paramsOrBuilder: RemoveParams | QueryBuilder
  ): Promise<Result<RemoveStats, Error>> {
    try {
      let query: Query;

      if (paramsOrBuilder instanceof RemoveParams) {
        query = this.queryBuilders.buildRemoveQuery(paramsOrBuilder);
      } else {
        query = paramsOrBuilder.build();
      }

      const stats = await this.source.remove(query);

      return Result.withContent(stats);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Counts the entities in the data source.
   *
   * @param {CountParams | QueryBuilder} paramsOrBuilder The parameters or QueryBuilder for the count operation (optional).
   *
   * @returns {Promise<Result<number, Error>>} The result of the count operation, containing the number of entities or an error.
   */
  public async count(
    paramsOrBuilder?: CountParams | QueryBuilder
  ): Promise<Result<number, Error>> {
    try {
      let query: Query;

      if (paramsOrBuilder instanceof CountParams) {
        query = this.queryBuilders.buildCountQuery(paramsOrBuilder);
      } else if (paramsOrBuilder?.build) {
        query = paramsOrBuilder.build();
      } else {
        query = {};
      }

      const count = await this.source.count(query);

      return Result.withContent(count);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Finds entities in the data source.
   *
   * @param {FindParams | QueryBuilder} paramsOrBuilder The parameters or QueryBuilder for the find operation (optional).
   *
   * @returns {Promise<Result<EntityType[], Error>>} The result of the find operation, containing the found entities or an error.
   */
  public async find(
    paramsOrBuilder?: FindParams | QueryBuilder
  ): Promise<Result<EntityType[], Error>> {
    try {
      let query: Query;
      if (paramsOrBuilder instanceof FindParams) {
        query = this.queryBuilders.buildFindQuery(paramsOrBuilder);
      } else if (paramsOrBuilder?.build) {
        query = paramsOrBuilder.build();
      } else {
        query = {};
      }

      const documents = await this.source.find(query);

      return Result.withContent(
        documents.map(document => this.mapper.toEntity(document))
      );
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
