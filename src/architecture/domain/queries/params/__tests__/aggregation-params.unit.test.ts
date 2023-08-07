import { Filter, Sort } from '../../../types';
import { Where } from '../../../where/where';
import { AggregationParams } from '../aggregation-params';

describe('AggregationParams', () => {
  describe('create', () => {
    it('should create a new instance of AggregationParams with the provided options', () => {
      const options = {
        groupBy: ['field1'],
        filterBy: { field: 'field2', name: 'Foo' },
        sort: { field3: 1 },
        sum: 'field4',
        average: 'field5',
        min: 'field6',
        max: 'field7',
        count: 'field8',
        where: new Where().valueOf('field9').isEq('value9'),
      };

      const aggregationParams = AggregationParams.create(options);

      expect(aggregationParams).toBeInstanceOf(AggregationParams);
      expect(aggregationParams.groupBy).toEqual(options.groupBy);
      expect(aggregationParams.filterBy).toEqual(options.filterBy);
      expect(aggregationParams.sort).toEqual(options.sort);
      expect(aggregationParams.sum).toEqual(options.sum);
      expect(aggregationParams.average).toEqual(options.average);
      expect(aggregationParams.min).toEqual(options.min);
      expect(aggregationParams.max).toEqual(options.max);
      expect(aggregationParams.count).toEqual(options.count);
      expect(aggregationParams.where).toEqual(options.where);
    });

    it('should create a new instance of AggregationParams with default options if not provided', () => {
      const aggregationParams = AggregationParams.create({});

      expect(aggregationParams).toBeInstanceOf(AggregationParams);
      expect(aggregationParams.groupBy).toBeUndefined();
      expect(aggregationParams.filterBy).toBeUndefined();
      expect(aggregationParams.sort).toBeUndefined();
      expect(aggregationParams.sum).toBeUndefined();
      expect(aggregationParams.average).toBeUndefined();
      expect(aggregationParams.min).toBeUndefined();
      expect(aggregationParams.max).toBeUndefined();
      expect(aggregationParams.count).toBeUndefined();
      expect(aggregationParams.where).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should construct a new instance of AggregationParams with the provided values', () => {
      const groupBy = ['field1'];
      const filterBy: Filter = { field: 'field2', name: 'Foo' };
      const sort: Sort = { field3: 1 };
      const sum = 'field4';
      const average = 'field5';
      const min = 'field6';
      const max = 'field7';
      const count = 'field8';
      const where = new Where().valueOf('field9').isEq('value9');

      const aggregationParams = new AggregationParams(
        groupBy,
        filterBy,
        sort,
        sum,
        average,
        min,
        max,
        count,
        where
      );

      expect(aggregationParams).toBeInstanceOf(AggregationParams);
      expect(aggregationParams.groupBy).toEqual(groupBy);
      expect(aggregationParams.filterBy).toEqual(filterBy);
      expect(aggregationParams.sort).toEqual(sort);
      expect(aggregationParams.sum).toEqual(sum);
      expect(aggregationParams.average).toEqual(average);
      expect(aggregationParams.min).toEqual(min);
      expect(aggregationParams.max).toEqual(max);
      expect(aggregationParams.count).toEqual(count);
      expect(aggregationParams.where).toEqual(where);
    });

    it('should construct a new instance of AggregationParams with undefined values if not provided', () => {
      const aggregationParams = new AggregationParams();

      expect(aggregationParams).toBeInstanceOf(AggregationParams);
      expect(aggregationParams.groupBy).toBeUndefined();
      expect(aggregationParams.filterBy).toBeUndefined();
      expect(aggregationParams.sort).toBeUndefined();
      expect(aggregationParams.sum).toBeUndefined();
      expect(aggregationParams.average).toBeUndefined();
      expect(aggregationParams.min).toBeUndefined();
      expect(aggregationParams.max).toBeUndefined();
      expect(aggregationParams.count).toBeUndefined();
      expect(aggregationParams.where).toBeUndefined();
    });
  });
});
