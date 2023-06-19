import { Mapper, PropertyMapping } from '../mapper';
import { MissingKeyMappingsError } from '../../domain/errors';
import { MapperImpl } from '../mapper-impl';

describe('Mapper', () => {
  const mockMapping: PropertyMapping = {
    key: 'test',
    mapper: (value: unknown) => value,
  };

  type MockEntity = { test: string };
  type MockModel = { test: string };

  let mapper: Mapper<MockEntity, MockModel>;

  beforeEach(() => {
    mapper = new MapperImpl<MockEntity, MockModel>();
    mapper['mappingFromEntity'].set('test', mockMapping);
  });

  it('should throw an error when trying to convert from model to entity', () => {
    expect(() => mapper.toEntity({ test: 'value' } as MockModel)).toThrowError(
      'Method not implemented.'
    );
  });

  it('should convert from entity to model', () => {
    expect(mapper.fromEntity({ test: 'value' })).toEqual({ test: 'value' });
  });

  it('should throw an error when entity has a key not present in mapping', () => {
    expect(() =>
      mapper.fromEntity({ test: 'value', missingKey: 'value' } as any)
    ).toThrowError(MissingKeyMappingsError);
  });

  it('should get entity key mapping', () => {
    expect(mapper.getEntityKeyMapping('test')).toEqual(mockMapping);
  });

  it('should return undefined when there is no key in mapping', () => {
    expect(mapper.getEntityKeyMapping('missingKey')).toBeUndefined();
  });
});
