import { Where } from '../../../where';
import { UpdateMethod, UpdateParams } from '../update-params';

describe('UpdateParams', () => {
  describe('create', () => {
    it('should create a new instance of UpdateParams with the provided options', () => {
      const updates = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];
      const where = new Where().valueOf('field1').isEq('value1');

      const updateParams = UpdateParams.createUpdateManyParams(updates, where);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.updates).toEqual(updates);
      expect(updateParams.where).toEqual([where]);
    });

    it('should create a new instance of UpdateParams with undefined where clause if not provided', () => {
      const update = { id: 1, name: 'Entity 1' };

      const updateParams = UpdateParams.createUpdateEachParams([{
        update,
        where: Where.is({}),
      } as any]);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.updates).toEqual([update]);
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of UpdateParams with the provided entities and where clause', () => {
      const updates = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];
      const where = new Where().valueOf('field1').isEq('value1');

      const updateParams = new UpdateParams(updates, [where], UpdateMethod.UpdateEach);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.updates).toEqual(updates);
      expect(updateParams.where).toEqual([where]);
    });

    it('should construct a new instance of UpdateParams with undefined where clause if not provided', () => {
      const updates = [
        { id: 1, name: 'Entity 1' },
        { id: 2, name: 'Entity 2' },
      ];

      const updateParams = new UpdateParams(updates, [], UpdateMethod.UpdateEach);

      expect(updateParams).toBeInstanceOf(UpdateParams);
      expect(updateParams.updates).toEqual(updates);
    });
  });
});
