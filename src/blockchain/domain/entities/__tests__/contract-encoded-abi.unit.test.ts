import { parseToBigInt } from '../../../../utils';
import { ContractEncodedAbi, ContractEncodedAbiJson } from '../contract-encoded-abi';

describe('ContractEncodedAbi', () => {
  const blockNumber = BigInt(123);
  const contract = '0x123';
  const hex = '0xabcdef';

  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a ContractEncodedAbi instance with the specified values', () => {
      const result = ContractEncodedAbi.create(blockNumber, contract, hex);

      expect(result.blockNumber).toBe(blockNumber);
      expect(result.contract).toBe(contract);
      expect(result.hex).toBe(hex);
    });

    // Add more test cases for different scenarios
  });

  describe('constructor', () => {
    it('should initialize the ContractEncodedAbi instance with the provided values', () => {
      const result = new ContractEncodedAbi(blockNumber, contract, hex);

      expect(result.blockNumber).toBe(blockNumber);
      expect(result.contract).toBe(contract);
      expect(result.hex).toBe(hex);
    });

    // Add more test cases for different scenarios
  });

  describe('toJson', () => {
    it('should convert the ContractEncodedAbi instance to JSON', () => {
      const instance = new ContractEncodedAbi(blockNumber, contract, hex);
      const expectedJson: ContractEncodedAbiJson = {
        blockNumber,
        contract,
        hex,
      };

      const result = instance.toJson();

      expect(result).toEqual(expectedJson);
    });

    // Add more test cases for different scenarios
  });
});
