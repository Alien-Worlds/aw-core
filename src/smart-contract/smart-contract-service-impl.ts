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

      if (result.rows.length === 0) {
        const { table, scope, lower_bound } = options;
        return Result.withFailure(
          Failure.fromError(
            new SmartContractDataNotFoundError({ table, bound: lower_bound, scope })
          )
        );
      }

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
