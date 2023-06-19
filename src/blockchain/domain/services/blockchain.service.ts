import { Result } from '../../../architecture';
import { BlockchainInfo } from '../types';

export abstract class BlockchainService {
  /**
   * Retrieves the blockchain information.
   * @returns {Promise<BlockchainInfo>} A promise that resolves with the blockchain information.
   */
  public abstract getInfo(): Promise<Result<BlockchainInfo>>;

  /**
   * Retrieves the block number of the head block.
   * @returns {Promise<bigint>} A promise that resolves with the head block number.
   */
  public abstract getHeadBlockNumber(): Promise<Result<bigint>>;

  /**
   * Retrieves the block number of the last irreversible block.
   * @returns {Promise<bigint>} A promise that resolves with the last irreversible block number.
   */
  public abstract getLastIrreversibleBlockNumber(): Promise<Result<bigint>>;
}
