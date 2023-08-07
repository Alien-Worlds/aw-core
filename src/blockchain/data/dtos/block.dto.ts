export type BlockNumberWithIdJsonModel = {
  block_num: string;
  block_id: string;
};

export type BlockJsonModel = {
  head?: BlockNumberWithIdJsonModel;
  this_block?: BlockNumberWithIdJsonModel;
  last_irreversible?: BlockNumberWithIdJsonModel;
  prev_block?: BlockNumberWithIdJsonModel;
  block?: Uint8Array;
  traces?: Uint8Array;
  deltas?: Uint8Array;
  abi_version?: string;
  [key: string]: unknown;
};
