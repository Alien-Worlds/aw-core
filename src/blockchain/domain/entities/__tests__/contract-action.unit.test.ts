import crypto from 'crypto';
import { Action } from '../action';
import { Entity } from '../../../../architecture';
import { ContractAction } from '../contract-action';
import { ContractActionProperties } from '../../types';

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
      } as ContractActionProperties;
      const actionData = {
        account: 'account',
        name: 'name',
        data: { foo: 'bar', toJSON: () => ({ foo: 'bar' }) },
        authorization: null,
      };
      const action = new Action(
        actionData.account,
        actionData.name,
        actionData.authorization,
        actionData.data as unknown as Entity
      );

      // Call create method
      const contractAction = ContractAction.create(properties, action);

      // Verify the ContractAction instance
      expect(contractAction).toBeInstanceOf(ContractAction);
      expect(contractAction.id).toBe(properties.id);
      expect(contractAction.blockTimestamp).toBe(properties.blockTimestamp);
      expect(contractAction.blockNumber).toBe(properties.blockNumber);
      expect(contractAction.globalSequence).toBe(properties.globalSequence);
      expect(contractAction.receiverSequence).toBe(properties.receiverSequence);
      expect(contractAction.transactionId).toBe(properties.transactionId);
      expect(contractAction.action).toBe(action);
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
        globalSequence: BigInt(456),
        receiverSequence: BigInt(789),
        transactionId: 'transactionId',
      };
      const actionData = {
        account: 'account',
        name: 'name',
        data: { foo: 'bar', toJSON: () => ({ foo: 'bar' }) },
        authorization: null,
      };
      const action = new Action(
        actionData.account,
        actionData.name,
        actionData.authorization,
        actionData.data as unknown as Entity
      );
      const contractAction = new ContractAction(
        properties.id,
        properties.blockTimestamp,
        properties.blockNumber,
        properties.globalSequence,
        properties.receiverSequence,
        properties.transactionId,
        action,
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
        action: action.toJSON(),
        action_hash: 'mockedHash',
      });
    });
  });
});
