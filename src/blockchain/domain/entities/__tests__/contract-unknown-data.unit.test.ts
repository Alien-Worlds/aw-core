import { UnknownObject } from '../../../../architecture';
import { ContractUnkownDataEntity } from '../contract-unkown-data';

describe('ContractUnkownDataEntity', () => {
  let data: UnknownObject;
  let entity: ContractUnkownDataEntity;

  beforeEach(() => {
    data = {
      prop1: 'value1',
      prop2: 'value2',
    };

    entity = ContractUnkownDataEntity.create(data);
  });

  test('should create a ContractUnkownDataEntity instance with correct data', () => {
    expect(entity).toBeInstanceOf(ContractUnkownDataEntity);
    expect(entity.id).toBeUndefined();
    expect(entity.toJSON()).toEqual(data);
  });

  test('should return the correct JSON representation of the ContractUnkownDataEntity', () => {
    expect(entity.toJSON()).toEqual(data);
  });
});
