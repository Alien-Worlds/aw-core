/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fetch from 'node-fetch';
import { JsonRpc } from 'eosjs';
import { GetTableRowsResult } from 'eosjs/dist/eosjs-rpc-interfaces';
import { EosRpcSource, GetTableRowsOptions } from './eos-rpc.source';

export class EosJsRpcSource implements EosRpcSource {
  private rpc: JsonRpc;

  constructor(url: string) {
    this.rpc = new JsonRpc(url, { fetch });
  }
  public async getTableRows(options: GetTableRowsOptions): Promise<GetTableRowsResult> {
    return this.rpc.get_table_rows(options);
  }
}
