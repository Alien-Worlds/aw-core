import {
  ContractStats,
  GetTableRowsOptions,
  GetTableRowsResult,
} from '../../domain/types';

/**
 * Abstract class representing an EOS RPC source.
 * @abstract
 * @class EosRpcSource
 */
export abstract class RpcSource {
  /**
   * Token associated with the EOS RPC source.
   * @type {string}
   * @static
   */
  public static Token: string;

  /**
   * Retrieves table rows based on the provided options.
   * @abstract
   * @param {GetTableRowsOptions} options - Options for retrieving table rows.
   * @returns {Promise<GetTableRowsResult>} A promise that resolves to the result of retrieving table rows.
   */
  public abstract getTableRows<RowType = unknown>(
    options: GetTableRowsOptions
  ): Promise<GetTableRowsResult<RowType>>;

  /**
   * Retrieves contract statistics for the specified account.
   * @abstract
   * @param {string} account - Account name.
   * @returns {Promise<ContractStats>} A promise that resolves to the contract statistics for the account.
   */
  public abstract getContractStats(account: string): Promise<ContractStats>;
}
