/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fetch from 'node-fetch';
import { JsonRpc } from 'eosjs';
import { GetTableRowsResult } from 'eosjs/dist/eosjs-rpc-interfaces';
import { RpcSource } from './rpc.source';
import { ContractStats, GetTableRowsOptions } from '../../domain/types';

/**
 * EosRpcSource class represents a source for making RPC requests to an EOS blockchain.
 * It implements the RpcSource interface.
 * @class
 */
export class EosRpcSource implements RpcSource {
  private rpc: JsonRpc;

  /**
   * Creates an instance of `EosJsRpcSource`.
   * @param {string} url - The URL of the EOS RPC endpoint.
   */
  constructor(url: string) {
    this.rpc = new JsonRpc(url, { fetch });
  }

  /**
   * Retrieves contract statistics for the specified account.
   * @param {string} account - Account name.
   * @returns {Promise<ContractStats>} A promise that resolves to the contract statistics for the account.
   */
  public async getContractStats(account: string): Promise<ContractStats> {
    return this.rpc.get_account(account) as unknown as ContractStats;
  }

  /**
   * Retrieves table rows based on the provided options.
   * @param {GetTableRowsOptions} options - Options for retrieving table rows.
   * @returns {Promise<GetTableRowsResult>} A promise that resolves to the result of retrieving table rows.
   */
  public async getTableRows(options: GetTableRowsOptions): Promise<GetTableRowsResult> {
    return this.rpc.get_table_rows(options);
  }
}
