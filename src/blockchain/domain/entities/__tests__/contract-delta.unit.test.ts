import crypto from 'crypto';
import { Entity } from '../../../../architecture';
import { ContractDelta } from '../contract-delta';
import { parseToBigInt } from '../../../../utils';
import { ContractDeltaModel } from '../../types';

// Mock crypto.createHash
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mockedHash'),
}));

describe('ContractDelta', () => {
  describe('create', () => {
    it('should create a ContractDelta instance with the provided properties and delta', () => {
      // Mocked data
      const properties = {
        id: 'deltaId',
        blockNumber: '123',
        code: 'code',
        scope: 'scope',
        table: 'table',
        payer: 'payer',
        primaryKey: '456',
        present: true,
        blockTimestamp: new Date(),
      } as ContractDeltaModel;
      const deltaData = { foo: 'bar' };
      const delta = { foo: 'bar', toJSON: () => deltaData } as unknown as Entity;

      // Call create method
      const contractDelta = ContractDelta.create(properties, delta);

      // Verify the ContractDelta instance
      expect(contractDelta).toBeInstanceOf(ContractDelta);
      expect(contractDelta.id).toBe(properties.id);
      expect(contractDelta.blockNumber).toBe(parseToBigInt(properties.blockNumber));
      expect(contractDelta.code).toBe(properties.code);
      expect(contractDelta.scope).toBe(properties.scope);
      expect(contractDelta.table).toBe(properties.table);
      expect(contractDelta.deltaHash).toBe('mockedHash');
      expect(contractDelta.delta).toBe(delta);
      expect(contractDelta.payer).toBe(properties.payer);
      expect(contractDelta.primaryKey).toBe(parseToBigInt(properties.primaryKey));
      expect(contractDelta.present).toBe(properties.present);
      expect(contractDelta.blockTimestamp).toBe(properties.blockTimestamp);
    });
  });

  describe('toJSON', () => {
    it('should return the JSON representation of the ContractDelta', () => {
      // Create a ContractDelta instance
      const properties = {
        id: 'deltaId',
        blockNumber: '123',
        code: 'code',
        scope: 'scope',
        table: 'table',
        payer: 'payer',
        primaryKey: '456',
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
        'mockedHash',
        delta,
        properties.payer,
        parseToBigInt(properties.primaryKey),
        properties.present,
        properties.blockTimestamp
      );

      // Call toJSON method
      const json = contractDelta.toJSON();

      // Verify the JSON representation
      expect(json).toEqual({
        id: properties.id,
        block_timestamp: properties.blockTimestamp.toISOString(),
        block_number: properties.blockNumber,
        code: properties.code,
        scope: properties.scope,
        table: properties.table,
        payer: properties.payer,
        primaryKey: properties.primaryKey,
        present: properties.present,
        data: delta.toJSON(),
        data_hash: 'mockedHash',
      });
    });
  });
});
