import { UnknownObject } from '../../../../architecture';
import { ContractUnknownData } from '../contract-unknown-data';

describe('ContractUnkownDataEntity', () => {
  let data: UnknownObject;
  let entity: ContractUnknownData;

  beforeEach(() => {
    data = {
      prop1: 'value1',
      prop2: 'value2',
    };

    entity = ContractUnknownData.create(data);
  });

  test('should create a ContractUnknownData instance with correct data', () => {
    expect(entity).toBeInstanceOf(ContractUnknownData);
    expect(entity.id).toBeUndefined();
    expect(entity.toJSON()).toEqual(data);
  });

  test('should return the correct JSON representation of the ContractUnknownData', () => {
    expect(entity.toJSON()).toEqual(data);
  });
});
