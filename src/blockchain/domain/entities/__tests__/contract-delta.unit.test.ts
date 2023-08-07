import { Entity } from '../../../../architecture';
import { ContractDelta } from '../contract-delta';
import { parseToBigInt } from '../../../../utils';
import { ContractDeltaModel } from '../../types';

describe('ContractDelta', () => {

  describe('toJSON', () => {
    it('should return the JSON representation of the ContractDelta', () => {
      const properties = {
        id: 'deltaId',
        blockNumber: '123',
        code: 'code',
        scope: 'scope',
        table: 'table',
        payer: 'payer',
        primary_key: '456',
        present: true,
        blockTimestamp: new Date(),
      };
      const deltaData = { foo: 'bar' };
      const delta = { foo: 'bar', toJSON: () => deltaData } as unknown as Entity;
      const contractDelta = new ContractDelta(
        properties.id,
        parseToBigInt(properties.blockNumber),
        properties.code,
        properties.scope,
        properties.table,
        delta,
        properties.payer,
        parseToBigInt(properties.primary_key),
        properties.present,
        properties.blockTimestamp
      );

      const json = contractDelta.toJSON();

      expect(json).toEqual({
        id: properties.id,
        block_timestamp: properties.blockTimestamp.toISOString(),
        block_number: properties.blockNumber,
        code: properties.code,
        scope: properties.scope,
        table: properties.table,
        payer: properties.payer,
        primary_key: properties.primary_key,
        present: properties.present,
        data: delta.toJSON(),
      });
    });
  });
});
