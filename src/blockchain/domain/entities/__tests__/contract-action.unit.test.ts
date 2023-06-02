import crypto from 'crypto';
import { serialize } from 'v8';
import { Entity } from '../../../../architecture';
import { Action } from '../action';
import { ContractAction } from '../contract-action';

describe('ContractAction', () => {
  const mockModel = {
    id: 'abc123',
    blockTimestamp: new Date(),
    blockNumber: BigInt(123),
    globalSequence: BigInt(456),
    receiverSequence: BigInt(789),
    transactionId: 'transaction123',
    data: {} as Entity,
    name: 'actionName',
    account: 'actionAccount',
  };

  const mockSerializedAction = serialize({
    name: mockModel.name,
    account: mockModel.account,
    data: mockModel.data,
  });
  const mockActionHash = crypto
    .createHash('sha1')
    .update(mockSerializedAction)
    .digest('hex');

  const mockAction = new Action(mockModel.account, mockModel.name, null, mockModel.data);
  const contractAction = new ContractAction(
    mockModel.id,
    mockModel.blockTimestamp,
    mockModel.blockNumber,
    mockModel.globalSequence,
    mockModel.receiverSequence,
    mockModel.transactionId,
    mockAction,
    mockActionHash
  );

  describe('create', () => {
    it('should create a ContractAction instance', () => {
      const result = ContractAction.create(mockModel);
      expect(result).toBeInstanceOf(ContractAction);
      expect(result.id).toBe(mockModel.id);
      expect(result.blockTimestamp).toBe(mockModel.blockTimestamp);
      expect(result.blockNumber).toBe(mockModel.blockNumber);
      expect(result.globalSequence).toBe(mockModel.globalSequence);
      expect(result.receiverSequence).toBe(mockModel.receiverSequence);
      expect(result.transactionId).toBe(mockModel.transactionId);
      expect(result.action).toEqual(mockAction);
      expect(result.actionHash).toBe(mockActionHash);
    });
  });

  describe('toJSON', () => {
    it('should return the JSON representation of the ContractAction', () => {
      const expectedJSON = {
        id: mockModel.id,
        block_timestamp: mockModel.blockTimestamp.toISOString(),
        block_number: mockModel.blockNumber.toString(),
        global_sequence: mockModel.globalSequence.toString(),
        receiver_sequence: mockModel.receiverSequence.toString(),
        transaction_id: mockModel.transactionId,
        action: mockAction.toJSON(),
        action_hash: mockActionHash,
      };

      const result = contractAction.toJSON();
      expect(result).toEqual(expectedJSON);
    });
  });
});
