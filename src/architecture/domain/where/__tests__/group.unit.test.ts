import { Group } from '../group';
import { WhereOperator } from '../where.enums';

describe('Group', () => {
  let group;

  beforeEach(() => {
    group = new Group();
  });

  it('should create an instance', () => {
    expect(group).toBeInstanceOf(Group);
  });

  describe('by', () => {
    it('should set groupBy', () => {
      group.by('field1');
      expect(group.getRaw().groupBy).toBe('field1');
    });

    it('should return the instance for chaining', () => {
      expect(group.by('field1')).toBe(group);
    });
  });

  describe('addAggregation', () => {
    it('should add an aggregation', () => {
      group.addAggregation('field2', WhereOperator.isGt);
      expect(group.getRaw().aggregations).toEqual({ field2: WhereOperator.isGt });
    });

    it('should return the instance for chaining', () => {
      expect(group.addAggregation('field2', WhereOperator.isGt)).toBe(group);
    });
  });

  describe('getRaw', () => {
    it('should return the raw group', () => {
      const rawGroup = {
        groupBy: 'field1',
        aggregations: { field2: WhereOperator.isGt },
      };
      group.by('field1').addAggregation('field2', WhereOperator.isGt);
      expect(group.getRaw()).toEqual(rawGroup);
    });
  });
});
