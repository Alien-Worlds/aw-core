import { Result } from '../../../architecture';
import { ContractStats } from '../types';

/**
 * An abstract class representing a Smart Contract Service.
 * @export
 * @abstract
 * @class ContractService
 */
export abstract class ContractService {
  /**
   * Retrieves the statistics of the smart contract.
   * @abstract
   * @param {string} contract - Contract name.
   * @returns {Promise<ContractStats>} A promise that resolves with the statistics of the smart contract.
   */
  public abstract getStats(contract?: string): Promise<Result<ContractStats>>;
}
