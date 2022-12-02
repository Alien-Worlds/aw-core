import { Failure, Result } from '../../../architecture';
import { SmartContractDataNotFoundError } from '../../domain/errors/smart-contract-data-not-found.error';
import { EosRpcSource, GetTableRowsOptions } from '../data-sources/eos-rpc.source';

/**
 * Represents a base class for the smart contracts -set by tables- repositories.
 *
 * @class
 */
export class SmartContractRepositoryImpl<EntityType, DtoType> {
  protected storage: Map<string, EntityType> = new Map();
  /**
   * @constructor
   * @param {EosRpcSource} source
   * @param {string} code
   * @param {string} table
   */
  constructor(
    protected source: EosRpcSource,
    protected code: string,
    protected table: string,
    protected mapper: (dto: unknown) => EntityType
  ) {}

  /**
   * Add entity to the storage.
   *
   * @param {string} key
   * @param {EntityType} entity
   * @returns {EntityType}
   */
  protected store(key: string, entity: EntityType): EntityType {
    if (this.storage.has(key)) {
      console.warn(
        `Storage already contains an entity assigned to the key ${key}, it will be overwritten.`
      );
    }
    this.storage.set(key, entity);
    return entity;
  }

  /**
   * @async
   * @param {string} bound
   * @param {string} scope
   * @returns {Promise<DtoType>}
   */
  // TODO: should be replaced by getOneRow with model
  protected async getOneRowBy(bound: string, scope: string): Promise<DtoType> {
    const result = await this.source.getTableRows({
      code: this.code,
      scope,
      table: this.table,
      lower_bound: bound,
      upper_bound: bound,
      limit: 1,
    });

    if (result.rows.length === 0) {
      throw new SmartContractDataNotFoundError({ bound, scope, table: this.table });
    }

    return result.rows[0] as DtoType;
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Promise<DtoType>}
   */
  protected async getOneRow(options: GetTableRowsOptions): Promise<DtoType> {
    const result = await this.source.getTableRows(options);

    if (result.rows.length === 0) {
      const { table, scope, lower_bound } = options;
      throw new SmartContractDataNotFoundError({ table, bound: lower_bound, scope });
    }

    return result.rows[0] as DtoType;
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Promise<DtoType>}
   */
  protected async getRows(options: GetTableRowsOptions): Promise<DtoType[]> {
    const result = await this.source.getTableRows(options);

    if (result.rows.length === 0) {
      const { table, scope, lower_bound } = options;
      throw new SmartContractDataNotFoundError({ table, bound: lower_bound, scope });
    }

    return result.rows as DtoType[];
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Result<EntityType[]>}
   */
  public async getMany(options: GetTableRowsOptions): Promise<Result<EntityType[]>> {
    try {
      options.table = this.table;
      options.code = this.code;

      const rows = await this.getRows(options);

      return Result.withContent(rows.map(row => this.mapper(row)));
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Result<CustodianSmartContractData>}
   */
  public async getOne(options: GetTableRowsOptions): Promise<Result<EntityType>> {
    try {
      options.table = this.table;
      options.code = this.code;

      const row = await this.getOneRow(options);

      return Result.withContent(this.mapper(row));
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
