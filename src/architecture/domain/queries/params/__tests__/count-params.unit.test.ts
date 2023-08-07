import { Sort } from '../../../types';
import { Where } from '../../../where/where';
import { CountParams } from '../count-params';

describe('CountParams', () => {
  describe('create', () => {
    it('should create a new instance of CountParams with the provided options', () => {
      const options = {
        sort: { field1: 1 },
        where: new Where().valueOf('field2').isEq('value2'),
      };

      const countParams = CountParams.create(options);

      expect(countParams).toBeInstanceOf(CountParams);
      expect(countParams.sort).toEqual(options.sort);
      expect(countParams.where).toEqual(options.where);
    });

    it('should create a new instance of CountParams with default options if not provided', () => {
      const countParams = CountParams.create(undefined);

      expect(countParams).toBeInstanceOf(CountParams);
      expect(countParams.sort).toBeUndefined();
      expect(countParams.where).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of CountParams with the provided values', () => {
      const sort: Sort = { field1: 1 };
      const where = new Where().valueOf('field2').isEq('value2');

      const countParams = new CountParams(sort, where);

      expect(countParams).toBeInstanceOf(CountParams);
      expect(countParams.sort).toEqual(sort);
      expect(countParams.where).toEqual(where);
    });

    it('should construct a new instance of CountParams with undefined values if not provided', () => {
      const countParams = new CountParams();

      expect(countParams).toBeInstanceOf(CountParams);
      expect(countParams.sort).toBeUndefined();
      expect(countParams.where).toBeUndefined();
    });
  });
});
