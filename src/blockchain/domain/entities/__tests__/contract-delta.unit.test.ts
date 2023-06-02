import { serialize } from 'v8';
import crypto from 'crypto';
import { ContractDeltaModel } from '../../types';
import { Entity } from '../../../../architecture';
import { ContractDelta } from '../contract-delta';
import { UnknownObject } from '../../../../architecture/domain/types';

describe('ContractDelta', () => {
  let model: ContractDeltaModel<Entity>;
  let delta: ContractDelta<Entity>;

  beforeEach(() => {
    // Initialize the model with sample data
    model = {
      id: 'delta_id',
      blockNumber: '1234567890',
      code: 'contract_code',
      scope: 'contract_scope',
      table: 'contract_table',
      data: { } as Entity,
      payer: 'contract_payer',
      primaryKey: '9876543210',
      present: 1,
      blockTimestamp: new Date(),
    };

    // Create the ContractDelta instance
    delta = ContractDelta.create(model);
  });

  test('should create a ContractDelta instance with correct properties', () => {
    expect(delta).toBeInstanceOf(ContractDelta);
    expect(delta.id).toBe(model.id);
    expect(delta.blockNumber).toBe(BigInt(model.blockNumber));
    expect(delta.code).toBe(model.code);
    expect(delta.scope).toBe(model.scope);
    expect(delta.table).toBe(model.table);
    expect(delta.dataHash).toBeDefined();
    expect(delta.data).toBe(model.data);
    expect(delta.payer).toBe(model.payer);
    expect(delta.primaryKey).toBe(BigInt(model.primaryKey));
    expect(delta.present).toBe(model.present);
    expect(delta.blockTimestamp).toBeInstanceOf(Date);
  });

  test('should generate the correct data hash using SHA-1 algorithm', () => {
    const dataBuffer = serialize(model.data);
    const expectedDataHash = crypto
      .createHash('sha1')
      .update(dataBuffer)
      .digest('hex');
    expect(delta.dataHash).toBe(expectedDataHash);
  });

  test('should return the correct JSON representation of the ContractDelta', () => {
    const expectedJSON: UnknownObject = {
      id: model.id,
      block_timestamp: model.blockTimestamp.toISOString(),
      block_number: model.blockNumber,
      code: model.code,
      scope: model.scope,
      table: model.table,
      payer: model.payer,
      primaryKey: model.primaryKey,
      present: model.present,
      data: model.data,
      data_hash: delta.dataHash,
    };

    expect(delta.toJSON()).toEqual(expectedJSON);
  });
});
