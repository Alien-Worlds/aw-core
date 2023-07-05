import { Where } from '../../../where/where';
import { RemoveParams } from '../remove-params';

describe('RemoveParams', () => {
  describe('create', () => {
    it('should create a new instance of RemoveParams with the provided options', () => {
      const where = new Where().valueOf('field1').isEq('value1');

      const removeParams = RemoveParams.create(where);

      expect(removeParams).toBeInstanceOf(RemoveParams);
      expect(removeParams.where).toEqual(where);
    });

    it('should create a new instance of RemoveParams with undefined where clause if not provided', () => {
      const removeParams = RemoveParams.create(undefined);

      expect(removeParams).toBeInstanceOf(RemoveParams);
      expect(removeParams.where).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of RemoveParams with the provided where clause', () => {
      const where = new Where().valueOf('field1').isEq('value1');

      const removeParams = new RemoveParams(where);

      expect(removeParams).toBeInstanceOf(RemoveParams);
      expect(removeParams.where).toEqual(where);
    });

    it('should construct a new instance of RemoveParams with undefined where clause if not provided', () => {
      const removeParams = new RemoveParams();

      expect(removeParams).toBeInstanceOf(RemoveParams);
      expect(removeParams.where).toBeUndefined();
    });
  });
});
