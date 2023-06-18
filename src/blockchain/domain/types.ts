import { UnknownObject } from '../../architecture/domain/types';

/**
 * Options for making a JSON-RPC request to get table rows.
 * @typedef {object} GetTableRowsOptions
 * @property {object} [json] - JSON payload for the request.
 * @property {string} [code] - Contract account name.
 * @property {string} [scope] - Table scope.
 * @property {string} [table] - Table name.
 * @property {string} [table_key] - Table key.
 * @property {string} [lower_bound] - Lower bound for the key.
 * @property {string} [upper_bound] - Upper bound for the key.
 * @property {number} [index_position] - Position of the index to use.
 * @property {string} [key_type] - Type of the key.
 * @property {number} [limit] - Maximum number of rows to return.
 * @property {boolean} [reverse] - Whether to return the rows in reverse order.
 * @property {boolean} [show_payer] - Whether to include the payer of the storage.
 * @property {unknown} [key: string] - Additional options as key-value pairs.
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

/**
 * Result object representing the response of retrieving table rows.
 * @typedef {object} GetTableRowsResult
 * @property {RowType[]} rows - The retrieved rows.
 * @property {boolean} more - Whether there are more rows to retrieve.
 * @property {string} next_key - The next key to use for retrieving the next batch of rows.
 * @property {string} next_key_bytes - The next key in bytes format.
 * @template RowType - The type of each row in the result.
 */
export type GetTableRowsResult<RowType = unknown> = {
  rows: RowType[];
  more: boolean;
  next_key: string;
  next_key_bytes: string;
};

/**
 * Information about account resource usage.
 * @typedef {object} AccountResourceInfo
 * @property {number} used - The amount of resource used.
 * @property {number} available - The amount of resource available.
 * @property {number} max - The maximum amount of resource allowed.
 * @property {string} [last_usage_update_time] - The time of the last resource usage update.
 * @property {number} [current_used] - The current amount of resource used.
 */
export type AccountResourceInfo = {
  used: number;
  available: number;
  max: number;
  last_usage_update_time?: string;
  current_used?: number;
};

/**
 * Permission object representing an authority's permission.
 * @typedef {object} Permission
 * @property {string} perm_name - The name of the permission.
 * @property {string} parent - The parent permission.
 * @property {Authority} required_auth - The required authority.
 */
export type Permission = {
  perm_name: string;
  parent: string;
  required_auth: Authority;
};

/**
 * Authority object representing the required authority for a permission.
 * @typedef {object} Authority
 * @property {number} threshold - The threshold required for authorization.
 * @property {KeyWeight[]} keys - The key-weight pairs for the authority.
 * @property {PermissionLevelWeight[]} accounts - The account-weight pairs for the authority.
 * @property {WaitWeight[]} waits - The wait-weight pairs for the authority.
 */
export type Authority = {
  threshold: number;
  keys: KeyWeight[];
  accounts: PermissionLevelWeight[];
  waits: WaitWeight[];
};

/**
 * Key-weight pair representing a key and its weight in an authority.
 * @typedef {object} KeyWeight
 * @property {string} key - The public key.
 * @property {number} weight - The weight assigned to the key.
 */
export type KeyWeight = {
  key: string;
  weight: number;
};

/**
 * Permission-level object representing an actor and permission pair.
 * @typedef {object} PermissionLevel
 * @property {string} actor - The account name of the actor.
 * @property {string} permission - The permission name.
 */
export type PermissionLevel = {
  actor: string;
  permission: string;
};

/**
 * Permission-level-weight pair representing a permission level and its weight in an authority.
 * @typedef {object} PermissionLevelWeight
 * @property {PermissionLevel} permission - The permission level.
 * @property {number} weight - The weight assigned to the permission level.
 */
export type PermissionLevelWeight = {
  permission: PermissionLevel;
  weight: number;
};

/**
 * Wait-weight pair representing a time delay and its weight in an authority.
 * @typedef {object} WaitWeight
 * @property {number} wait_sec - The time delay in seconds.
 * @property {number} weight - The weight assigned to the time delay.
 */
export type WaitWeight = {
  wait_sec: number;
  weight: number;
};

/**
 * Overview of resources owned by an account.
 * @typedef {object} ResourceOverview
 * @property {string} owner - The owner of the resources.
 * @property {number} ram_bytes - The amount of RAM in bytes.
 * @property {string} net_weight - The network bandwidth weight.
 * @property {string} cpu_weight - The CPU bandwidth weight.
 */
export type ResourceOverview = {
  owner: string;
  ram_bytes: number;
  net_weight: string;
  cpu_weight: string;
};

/**
 * Resource delegation information.
 * @typedef {object} ResourceDelegation
 * @property {string} from - The account delegating resources.
 * @property {string} to - The account receiving the delegated resources.
 * @property {string} net_weight - The network bandwidth weight being delegated.
 * @property {string} cpu_weight - The CPU bandwidth weight being delegated.
 */
export type ResourceDelegation = {
  from: string;
  to: string;
  net_weight: string;
  cpu_weight: string;
};

/**
 * Refund request object representing a request for resource refund.
 * @typedef {object} RefundRequest
 * @property {string} owner - The account requesting the refund.
 * @property {string} request_time - The time of the refund request.
 * @property {string} net_amount - The refunded network bandwidth amount.
 * @property {string} cpu_amount - The refunded CPU bandwidth amount.
 */
export type RefundRequest = {
  owner: string;
  request_time: string;
  net_amount: string;
  cpu_amount: string;
};

/**
 * Contract statistics object representing the result of retrieving account information.
 */
export type ContractStats = {
  account_name?: string;
  first_block_num?: number;
  head_block_num?: number;
  head_block_time?: string;
  privileged?: boolean;
  last_code_update?: string;
  created?: string;
  core_liquid_balance?: string;
  ram_quota?: number;
  net_weight?: number;
  cpu_weight?: number;
  net_limit?: AccountResourceInfo;
  cpu_limit?: AccountResourceInfo;
  ram_usage?: number;
  permissions?: Permission[];
  total_resources?: ResourceOverview | null;
  self_delegated_bandwidth?: ResourceDelegation | null;
  refund_request?: RefundRequest | null;
  voter_info?: unknown;
  rex_info?: unknown;
} & UnknownObject;

export type BlockchainInfo = {
  server_version?: string;
  chain_id?: string;
  head_block_num?: number;
  last_irreversible_block_num?: number;
  last_irreversible_block_id?: string;
  last_irreversible_block_time?: string;
  head_block_id?: string;
  head_block_time?: string;
  head_block_producer?: string;
  virtual_block_cpu_limit?: number;
  virtual_block_net_limit?: number;
  block_cpu_limit?: number;
  block_net_limit?: number;
  server_version_string?: string;
  fork_db_head_block_num?: number;
  fork_db_head_block_id?: string;
  server_full_version_string?: string;
  first_block_num?: number;
} & UnknownObject;

/**
 * Represents the model for an action.
 * @typedef {object} ActionModel
 * @property {string} account - The account associated with the action.
 * @property {string} name - The name of the action.
 * @property {unknown} data - The data associated with the action.
 * @property {PermissionLevel[]} authorization - The array of Permission-level object representing an actor and permission pair.
 */
export type ActionModel = {
  account: string;
  name: string;
  data?: unknown;
  authorization?: PermissionLevel[];
};

/**
 * Represents the model for a contract action.
 * @typedef {object} ContractActionModel
 * @property {string} account - The account associated with the action.
 * @property {string} name - The name of the action.
 * @property {Date} blockTimestamp - The timestamp of the block.
 * @property {bigint} blockNumber - The number of the block.
 * @property {bigint} globalSequence - The global sequence of the action.
 * @property {bigint} receiverSequence - The receiver sequence of the action.
 * @property {string} transactionId - The ID of the transaction.
 * @property {unknown} data - The data associated with the action.
 * @property {string} [actionHash] - The hash of the action. Optional.
 * @property {string} [id] - The ID of the action. Optional.
 */
export type ContractActionModel = {
  account: string;
  name: string;
  blockTimestamp: Date;
  blockNumber: bigint;
  globalSequence: bigint;
  receiverSequence: bigint;
  transactionId: string;
  data: unknown;
  id: string;
};

/**
 * Represents the model for a contract delta.
 * @typedef {object} ContractDeltaModel
 * @property {string} id - The ID of the delta.
 * @property {string|bigint} blockNumber - The number of the block.
 * @property {string} code - The code of the contract.
 * @property {string} scope - The scope of the contract.
 * @property {string} table - The table of the contract.
 * @property {string} payer - The payer of the contract.
 * @property {string|bigint} primaryKey - The primary key of the contract.
 * @property {number} present - The present state of the contract.
 * @property {Date} blockTimestamp - The timestamp of the block.
 * @property {unknown} data - The data associated with the contract delta.
 */
export type ContractDeltaModel = {
  id: string;
  blockNumber: string | bigint;
  code: string;
  scope: string;
  table: string;
  payer: string;
  primaryKey: string | bigint;
  present: boolean;
  blockTimestamp: Date;
  data: unknown;
};
