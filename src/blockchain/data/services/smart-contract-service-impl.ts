import { Failure, Result } from '../../../architecture';
import { SmartContractDataNotFoundError } from '../..';
import { SmartContractService } from '../../domain/services/smart-contract-service';
import { ContractStats, GetTableRowsOptions } from '../../domain/types';
import { RpcSource } from '../data-sources/rpc.source';

/**
 * SmartContractServiceImpl class implements the SmartContractService interface and provides
 * the implementation for interacting with smart contracts.
 * @class
 */
export class SmartContractServiceImpl implements SmartContractService {
  /**
   * Creates an instance of SmartContractServiceImpl.
   * @param {RpcSource} rpcSource - The RPC source for making blockchain requests.
   * @param {string} name - The name of the smart contract.
   */
  constructor(protected rpcSource: RpcSource, protected name: string) {}

  /**
   * Retrieves the contract statistics for the smart contract.
   * @async
   * @returns {Promise<ContractStats>} A promise that resolves to the contract statistics.
   */
  public async getStats(): Promise<ContractStats> {
    return this.rpcSource.getContractStats(this.name);
  }

  /**
   * Retrieves all rows of data for the specified key and options.
   *
   * Note: Concrete implementations of the SmartContractService should extend this implementation and provide a custom `fetch<TableName>` method to retrieve the specific table.
   * Inside the `fetch<TableName>` method, developers can utilize this protected method to retrieve data with proper types.
   *
   * @async
   * @param {string} key - The key used for pagination.
   * @param {GetTableRowsOptions} options - Options for retrieving table rows.
   * @returns {Promise<Result<DataType[]>>} A promise that resolves to the result containing the rows of data.
   */
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
   * Retrieves multiple rows of data based on the provided options.
   *
   * Note: Concrete implementations of the SmartContractService should extend this implementation and provide a custom `fetch<TableName>` method to retrieve the specific table.
   * Inside the `fetch<TableName>` method, developers can utilize this protected method to retrieve data with proper types.
   *
   * @async
   * @param {GetTableRowsOptions} options - Options for retrieving table rows.
   * @returns {Promise<Result<DataType[]>>} A promise that resolves to the result containing the rows of data.
   */
  protected async getMany<DataType>(
    options: GetTableRowsOptions
  ): Promise<Result<DataType[]>> {
    try {
      const result = await this.rpcSource.getTableRows<DataType>(options);
      result.rows;
      return Result.withContent(result.rows);
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }

  /**
   * Retrieves a single row of data based on the provided options.
   *
   * Note: Concrete implementations of the SmartContractService should extend this implementation and provide a custom `fetch<TableName>` method to retrieve the specific table.
   * Inside the `fetch<TableName>` method, developers can utilize this protected method to retrieve data with proper types.
   *
   * @async
   * @param {GetTableRowsOptions} options - Options for retrieving table rows.
   * @returns {Promise<Result<DataType>>} A promise that resolves to the result containing the row of data.
   */
  protected async getOne<DataType>(
    options: GetTableRowsOptions
  ): Promise<Result<DataType>> {
    try {
      options.limit = 1;
      const result = await this.rpcSource.getTableRows<DataType>(options);

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
