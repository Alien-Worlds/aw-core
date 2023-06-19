import { ContractEncodedAbi } from '../entities/contract-encoded-abi';

/**
 * An abstract class that represents the ABI service.
 * All subclasses must implement the fetchAbis method.
 */
export abstract class AbiService {
  /**
   * Fetches the ABI (Application Binary Interface) for a given contract.
   *
   * @param {string} contract - The contract name for which the ABI is to be fetched.
   * @returns {Promise<ContractEncodedAbi[]>} - A Promise that resolves to an array of encoded ABI objects associated with the contract.
   */
  public abstract fetchAbis(contract: string): Promise<ContractEncodedAbi[]>;
}
