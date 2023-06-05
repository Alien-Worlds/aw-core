import crypto from 'crypto';
import { ContractAction } from '../contract-action';
import { ContractActionModel } from '../../types';

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mockedHash'),
}));

describe('ContractAction', () => {
  describe('create', () => {
    it('should create a ContractAction instance with the provided properties and action', () => {
      // Mocked data
      const properties = {
        id: 'actionId',
        blockTimestamp: new Date(),
        blockNumber: BigInt(123),
        globalSequence: BigInt(456),
        receiverSequence: BigInt(789),
        transactionId: 'transactionId',
        account: 'account',
        name: 'name',
        data: { foo: 'bar' },
      } as ContractActionModel;
      const actionData = { foo: 'bar', toJSON: () => ({ foo: 'bar' }) };

      // Call create method
      const contractAction = ContractAction.create(properties, actionData);

      // Verify the ContractAction instance
      expect(contractAction).toBeInstanceOf(ContractAction);
      expect(contractAction.id).toBe(properties.id);
      expect(contractAction.blockTimestamp).toBe(properties.blockTimestamp);
      expect(contractAction.blockNumber).toBe(properties.blockNumber);
      expect(contractAction.globalSequence).toBe(properties.globalSequence);
      expect(contractAction.receiverSequence).toBe(properties.receiverSequence);
      expect(contractAction.transactionId).toBe(properties.transactionId);
      expect(contractAction.account).toBe(properties.account);
      expect(contractAction.name).toBe(properties.name);
      expect(contractAction.actionHash).toBe('mockedHash');
    });
  });

  describe('toJSON', () => {
    it('should return the JSON representation of the ContractAction', () => {
      // Create a ContractAction instance
      const properties = {
        id: 'actionId',
        blockTimestamp: new Date(),
        blockNumber: BigInt(123),
        account: 'account',
        name: 'name',
        globalSequence: BigInt(456),
        receiverSequence: BigInt(789),
        transactionId: 'transactionId',
      };
      const actionData = { foo: 'bar', toJSON: () => ({ foo: 'bar' }) };

      const contractAction = new ContractAction(
        properties.id,
        properties.blockTimestamp,
        properties.blockNumber,
        properties.account,
        properties.name,
        properties.globalSequence,
        properties.receiverSequence,
        properties.transactionId,
        actionData,
        'mockedHash'
      );

      // Call toJSON method
      const json = contractAction.toJSON();

      // Verify the JSON representation
      expect(json).toEqual({
        id: properties.id,
        block_timestamp: properties.blockTimestamp.toISOString(),
        block_number: properties.blockNumber.toString(),
        global_sequence: properties.globalSequence.toString(),
        receiver_sequence: properties.receiverSequence.toString(),
        transaction_id: properties.transactionId,
        data: actionData.toJSON(),
        action_hash: 'mockedHash',
        account: properties.account,
        name: properties.name,
      });
    });
  });
});
