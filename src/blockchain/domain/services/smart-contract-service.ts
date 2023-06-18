import { ContractStats } from "../types";

/**
 * An abstract class representing a Smart Contract Service.
 * @export
 * @abstract
 * @class SmartContractService
 */
export abstract class SmartContractService {
  /**
   * Retrieves the statistics of the smart contract.
   * @abstract
   * @returns {Promise<ContractStats>} A promise that resolves with the statistics of the smart contract.
   */
  public abstract getStats(): Promise<ContractStats>;
}
