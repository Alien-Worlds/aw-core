import {
  BlockchainInfo,
  ContractStats,
  GetTableRowsOptions,
  GetTableRowsResult,
} from '../../domain/types';

/**
 * Abstract class representing an RPC source.
 * @abstract
 * @class RpcSource
 */
export abstract class RpcSource {
  /**
   * Token associated with the RPC source.
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

  /**
   * Retrieves the blockchain information.
   * @returns {Promise<BlockchainInfo>} A promise that resolves with the blockchain information.
   */
  public abstract getInfo(): Promise<BlockchainInfo>;

  /**
   * Retrieves the block number of the head block.
   * @returns {Promise<bigint>} A promise that resolves with the head block number.
   */
  public abstract getHeadBlockNumber(): Promise<bigint>;

  /**
   * Retrieves the block number of the last irreversible block.
   * @returns {Promise<bigint>} A promise that resolves with the last irreversible block number.
   */
  public abstract getLastIrreversibleBlockNumber(): Promise<bigint>;
}
