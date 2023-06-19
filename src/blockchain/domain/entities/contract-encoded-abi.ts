import { parseToBigInt } from '../../../utils';

export type ContractEncodedAbiJson = {
  blockNumber: bigint;
  contract: string;
  hex: string;
};

/**
 * Represents an encoded ABI (Application Binary Interface) for a contract.
 */
export class ContractEncodedAbi {
  /**
   * Creates a ContractEncodedAbi instance with the specified block number, contract address, and hex code.
   *
   * @param {unknown} blockNumber - The block number.
   * @param {string} contract - The contract address.
   * @param {string} hex - The hex code representing the ABI.
   * @returns {ContractEncodedAbi} A new ContractEncodedAbi instance.
   */
  public static create(
    blockNumber: unknown,
    contract: string,
    hex: string
  ): ContractEncodedAbi {
    return new ContractEncodedAbi(parseToBigInt(blockNumber), contract, hex);
  }

  /**
   * Constructs a new instance of the ContractEncodedAbi class.
   *
   * @param {bigint} blockNumber - The block number.
   * @param {string} contract - The contract address.
   * @param {string} hex - The hex code representing the ABI.
   */
  constructor(
    public readonly blockNumber: bigint,
    public readonly contract: string,
    public readonly hex: string
  ) {}

  /**
   * Converts the ContractEncodedAbi instance to a JSON format.
   *
   * @returns {ContractEncodedAbiJson} The ContractEncodedAbi instance as JSON.
   */
  public toJson(): ContractEncodedAbiJson {
    const { blockNumber, hex, contract } = this;

    return {
      blockNumber,
      hex,
      contract,
    };
  }
}
