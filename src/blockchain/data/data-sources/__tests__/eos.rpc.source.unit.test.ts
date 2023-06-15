import { BlockchainInfo } from '../../../domain/types';
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

  describe('getInfo', () => {
    it('should retrieve the blockchain information', async () => {
      (JsonRpc as jest.Mock).mockImplementation(() => ({
        get_info: jest.fn(),
      }));
      const rpcSource = new EosRpcSource('http://example.com');
      const mockInfo: BlockchainInfo = {};
      jest.spyOn((rpcSource as any).rpc, 'get_info').mockResolvedValue(mockInfo);

      const result = await rpcSource.getInfo();

      expect(result).toEqual(mockInfo);
      expect((rpcSource as any).rpc.get_info).toHaveBeenCalled();
    });
  });

  describe('getHeadBlockNumber', () => {
    it('should retrieve the head block number', async () => {
      (JsonRpc as jest.Mock).mockImplementation(() => ({
        get_info: jest.fn(() => ({
          last_irreversible_block_num: 789012,
          head_block_num: 123456,
        })),
      }));
      const rpcSource = new EosRpcSource('http://example.com');
      const mockInfo: BlockchainInfo = { head_block_num: 123456 };
      jest.spyOn((rpcSource as any).rpc, 'get_info').mockResolvedValue(mockInfo);

      const result = await rpcSource.getHeadBlockNumber();

      expect(result).toBe(BigInt(123456));
      expect((rpcSource as any).rpc.get_info).toHaveBeenCalled();
    });
  });

  describe('getLastIrreversibleBlockNumber', () => {
    it('should retrieve the last irreversible block number', async () => {
      (JsonRpc as jest.Mock).mockImplementation(() => ({
        get_info: jest.fn(() => ({
          last_irreversible_block_num: 789012,
          head_block_num: 123456,
        })),
      }));
      const rpcSource = new EosRpcSource('http://example.com');
      const mockInfo: BlockchainInfo = { last_irreversible_block_num: 789012 };
      jest.spyOn((rpcSource as any).rpc, 'get_info').mockResolvedValue(mockInfo);

      const result = await rpcSource.getLastIrreversibleBlockNumber();

      expect(result).toBe(BigInt(789012));
      expect((rpcSource as any).rpc.get_info).toHaveBeenCalled();
    });
  });
});
