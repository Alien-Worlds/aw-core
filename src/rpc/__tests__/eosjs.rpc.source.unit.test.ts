import { EosJsRpcSource } from '../eosjs.rpc.source';

jest.mock('node-fetch');
jest.mock('eosjs', () => {
  return {
    JsonRpc: jest.fn().mockImplementation(() => {
      return {
        get_table_rows: () => getTableRowsResult,
        get_account: () => getAccountResult
      };
    }),
  };
});

const getTableRowsResult = {rows: [],
    more: true,
    next_key: 'foo',
    next_key_bytes: '123456'}

const getAccountResult = {rows: [],
  account_name: 'foo',
  head_block_num: 1000,
  head_block_time: '000000',
  privileged: false,
}


describe('EosRpc source Unit tests', () => {
  it('Should return table rows', async () => {
    const rpc = new EosJsRpcSource('');
    const result = await rpc.getTableRows({});

    expect(result).toEqual(getTableRowsResult)
  });

  it('Should return contract stats', async () => {
    const rpc = new EosJsRpcSource('');
    const result = await rpc.getContractStats('foo');

    expect(result).toEqual(getAccountResult)
  });
});
