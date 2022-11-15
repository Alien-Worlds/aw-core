import fetch from 'node-fetch';
import { JsonRpc } from 'eosjs';
import { EosJsRpcSource } from '../eosjs.rpc.source';

jest.mock('node-fetch');
jest.mock('eosjs', () => {
  return {
    JsonRpc: jest.fn().mockImplementation(() => {
      return {
        get_table_rows: () => getTableRowsResult
      };
    }),
  };
});

const getTableRowsResult = {rows: [],
    more: true,
    next_key: 'foo',
    next_key_bytes: '123456'}


describe('EosRpc source Unit tests', () => {
  it('Should return table rows', async () => {
    const rpc = new EosJsRpcSource('');
    const result = await rpc.getTableRows({});

    expect(result).toEqual(getTableRowsResult)
  });
});
