import { Where } from '../../../where';
import { UpdateParams } from '../update-params';

describe('UpdateParams', () => {
  describe('create', () => {
    it('should create a new instance of UpdateParams with the provided options', () => {
      const entities = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];
      const where = new Where().valueOf('field1').isEq('value1');

      const updateParams = UpdateParams.create(entities, where);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.entities).toEqual(entities);
      expect(updateParams.where).toEqual(where);
    });

    it('should create a new instance of UpdateParams with undefined where clause if not provided', () => {
      const entities = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];

      const updateParams = UpdateParams.create(entities);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.entities).toEqual(entities);
      expect(updateParams.where).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of UpdateParams with the provided entities and where clause', () => {
      const entities = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];
      const where = new Where().valueOf('field1').isEq('value1');

      const updateParams = new UpdateParams(entities, where);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.entities).toEqual(entities);
      expect(updateParams.where).toEqual(where);
    });

    it('should construct a new instance of UpdateParams with undefined where clause if not provided', () => {
      const entities = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];

      const updateParams = new UpdateParams(entities);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.entities).toEqual(entities);
      expect(updateParams.where).toBeUndefined();
    });
  });
});
