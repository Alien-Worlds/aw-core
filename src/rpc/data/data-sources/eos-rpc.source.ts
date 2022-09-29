import { GetTableRowsResult } from 'eosjs/dist/eosjs-rpc-interfaces';

/**
 * JsonRpc request options
 * @type
 */
export type GetTableRowsOptions = {
  json?: object,
  code?: string,
  scope?: string,
  table?: string,
  table_key?: string,
  lower_bound?: string,
  upper_bound?: string,
  index_position?: number,
  key_type?: string,
  limit?: number,
  reverse?: boolean,
  show_payer?: boolean,
  [key:string]: unknown
};

/**
 * It is the interface for eos JsonRpc.
 * Implementations and binding can be found in the ioc config files (ioc.config.ts).
 *
 * @abstract
 * @class
 */
export abstract class EosRpcSource {
  public static Token: 'EOS_RPC_SOURCE';

  /**
   * Get the data rows based on the given options.
   *
   * @abstract
   * @async
   * @param {GetTableRowsOptions} options
   */
  public abstract getTableRows(options: GetTableRowsOptions): Promise<GetTableRowsResult>;
}
