import { ContractAction } from '../contract-action';

describe('ContractAction', () => {
  describe('toJSON', () => {
    it('should return the JSON representation of the ContractAction', () => {
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
      );

      const json = contractAction.toJSON();

      expect(json).toEqual({
        id: properties.id,
        block_timestamp: properties.blockTimestamp.toISOString(),
        block_number: properties.blockNumber.toString(),
        global_sequence: properties.globalSequence.toString(),
        recv_sequence: properties.receiverSequence.toString(),
        transaction_id: properties.transactionId,
        data: actionData.toJSON(),
        account: properties.account,
        name: properties.name,
      });
    });
  });
});
