import { Sort } from '../../../types';
import { Where } from '../../../where';
import { FindParams } from '../find-params';

describe('FindParams', () => {
  describe('create', () => {
    it('should create a new instance of FindParams with the provided options', () => {
      const options = {
        limit: 10,
        offset: 0,
        sort: { field1: 1 },
        where: new Where().valueOf('field2').isEq('value2'),
      };

      const findParams = FindParams.create(options);

      expect(findParams).toBeInstanceOf(FindParams);
      expect(findParams.limit).toEqual(options.limit);
      expect(findParams.offset).toEqual(options.offset);
      expect(findParams.sort).toEqual(options.sort);
      expect(findParams.where).toEqual(options.where);
    });

    it('should create a new instance of FindParams with default options if not provided', () => {
      const findParams = FindParams.create({});

      expect(findParams).toBeInstanceOf(FindParams);
      expect(findParams.limit).toBeUndefined();
      expect(findParams.offset).toBeUndefined();
      expect(findParams.sort).toBeUndefined();
      expect(findParams.where).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of FindParams with the provided values', () => {
      const limit = 10;
      const offset = 0;
      const sort: Sort = { field1: 1 };
      const where = new Where().valueOf('field2').isEq('value2');

      const findParams = new FindParams(limit, offset, sort, where);

      expect(findParams).toBeInstanceOf(FindParams);
      expect(findParams.limit).toEqual(limit);
      expect(findParams.offset).toEqual(offset);
      expect(findParams.sort).toEqual(sort);
      expect(findParams.where).toEqual(where);
    });

    it('should construct a new instance of FindParams with undefined values if not provided', () => {
      const findParams = new FindParams();

      expect(findParams).toBeInstanceOf(FindParams);
      expect(findParams.limit).toBeUndefined();
      expect(findParams.offset).toBeUndefined();
      expect(findParams.sort).toBeUndefined();
      expect(findParams.where).toBeUndefined();
    });
  });
});
