import { GetTableRowsResult } from 'eosjs/dist/eosjs-rpc-interfaces';

/**
 * JsonRpc request options
 * @type
 */
export type GetTableRowsOptions = {
  json?: object;
  code?: string;
  scope?: string;
  table?: string;
  table_key?: string;
  lower_bound?: string;
  upper_bound?: string;
  index_position?: number;
  key_type?: string;
  limit?: number;
  reverse?: boolean;
  show_payer?: boolean;
  [key: string]: unknown;
};

export type ContractStats = {
  account_name?: string;
  head_block_num?: number;
  head_block_time?: string;
  privileged?: false;
  last_code_update?: string;
  created?: string;
  ram_quota?: number;
  net_weight?: number;
  cpu_weight?: string;
  net_limit?: {
    used?: number;
    available?: number;
    max?: number;
    last_usage_update_time?: string;
    current_used?: 0;
  };
  cpu_limit?: {
    used?: number;
    available?: number;
    max?: number;
    last_usage_update_time?: string;
    current_used?: number;
  };
  ram_usage?: number;
  permissions?: {
    perm_name?: string;
    parent?: string;
    required_auth?: unknown[];
    linked_actions?: unknown[];
  }[];
  total_resources?: {
    owner?: string;
    net_weight?: string;
    cpu_weight?: string;
    ram_bytes?: number;
  };
  self_delegated_bandwidth?: unknown;
  refund_request?: unknown;
  voter_info?: unknown;
  rex_info?: unknown;
  subjective_cpu_bill_limit?: {
    used?: number;
    available?: number;
    max?: number;
    last_usage_update_time?: string;
    current_used?: number;
  };
  eosio_any_linked_actions?: unknown[];
};

/**
 * It is the interface for eos JsonRpc.
 * Implementations and binding can be found in the ioc config files (ioc.config.ts).
 *
 * @abstract
 * @class
 */
export abstract class EosRpcSource {
  public static Token: string;

  /**
   * Get the data rows based on the given options.
   *
   * @abstract
   * @async
   * @param {GetTableRowsOptions} options
   */
  public abstract getTableRows(options: GetTableRowsOptions): Promise<GetTableRowsResult>;
  public abstract getContractStats(account: string): Promise<ContractStats>;
}
