import { EosRpcSource } from '../eos.rpc.source';
import { JsonRpc } from 'eosjs';

jest.mock('eosjs');

describe('EosRpcSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call get_account method on JsonRpc instance', async () => {
    const mockGetAccount = jest.fn();
    (JsonRpc as jest.Mock).mockImplementation(() => ({
      get_account: mockGetAccount,
      get_table_rows: jest.fn(),
    }));

    const account = 'example_account';
    const rpcSource = new EosRpcSource('http://example.com');

    await rpcSource.getContractStats(account);

    expect(mockGetAccount).toHaveBeenCalledWith(account);
  });

  it('should call get_table_rows method on JsonRpc instance', async () => {
    const mockGetTableRows = jest.fn();
    (JsonRpc as jest.Mock).mockImplementation(() => ({
      get_account: jest.fn(),
      get_table_rows: mockGetTableRows,
    }));

    const options = {
      code: 'example_code',
      table: 'example_table',
    };
    const rpcSource = new EosRpcSource('http://example.com');

    await rpcSource.getTableRows(options);

    expect(mockGetTableRows).toHaveBeenCalledWith(options);
  });
});
