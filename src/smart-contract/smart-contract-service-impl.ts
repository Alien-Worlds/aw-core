import { Failure, Result } from '../architecture';
import {
  ContractStats,
  EosRpcSource,
  GetTableRowsOptions,
  SmartContractDataNotFoundError,
} from '../rpc';
import { SmartContractService } from './smart-contract-service';

export class SmartContractServiceImpl implements SmartContractService {
  constructor(protected rpcSource: EosRpcSource, protected name: string) {
    //
  }
  public async getStats(): Promise<ContractStats> {
    return this.rpcSource.getContractStats(this.name);
  }

  protected async getAll<DataType>(
    key: string,
    options: GetTableRowsOptions
  ): Promise<Result<DataType[]>> {
    try {
      const rows = [];
      const { code, scope, table, limit } = options;
      const query: GetTableRowsOptions = { code, scope, table, limit: limit || 100 };
      let read = true;

      while (read) {
        const resultSize = rows.length;
        if (resultSize > 0) {
          query.lower_bound = rows.at(-1)[key];
        }

        const table = await this.rpcSource.getTableRows(query);

        if (resultSize === 0) {
          rows.push(...table.rows);
        } else if (resultSize > 0 && table.rows.length > 1) {
          rows.push(...table.rows.slice(1));
        } else {
          read = false;
        }
      }

      return Result.withContent(rows);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Result<DataType[]>}
   */
  protected async getMany<DataType>(
    options: GetTableRowsOptions
  ): Promise<Result<DataType[]>> {
    try {
      const result = await this.rpcSource.getTableRows(options);

      return Result.withContent(result.rows);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Result<DataType>}
   */
  protected async getOne<DataType>(
    options: GetTableRowsOptions
  ): Promise<Result<DataType>> {
    try {
      options.limit = 1;
      const result = await this.rpcSource.getTableRows(options);

      if (result.rows.length === 0) {
        const { table, scope, lower_bound } = options;
        return Result.withFailure(
          Failure.fromError(
            new SmartContractDataNotFoundError({ table, bound: lower_bound, scope })
          )
        );
      }

      return Result.withContent(result.rows[0]);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
