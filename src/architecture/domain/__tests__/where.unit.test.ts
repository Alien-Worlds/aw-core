import { Where, WhereOperator } from '../where';

describe('Where', () => {
  let where: Where;

  beforeEach(() => {
    where = new Where();
  });

  describe('isEq', () => {
    it('should add an "isEq" condition to the current Where clause', () => {
      where.valueOf('key').isEq('value');

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isEq, value: 'value' },
      });
    });
  });

  describe('isIn', () => {
    it('should add an "isIn" condition to the current Where clause', () => {
      where.valueOf('key').isIn(['value1', 'value2']);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isIn, value: ['value1', 'value2'] },
      });
    });
  });

  describe('isNotEq', () => {
    it('should add an "isNotEq" condition to the current Where clause', () => {
      where.valueOf('key').isNotEq('value');

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNotEq, value: 'value' },
      });
    });
  });

  describe('isLt', () => {
    it('should add an "isLt" condition to the current Where clause', () => {
      where.valueOf('key').isLt(10);

      expect(where.result).toEqual({ key: { operator: WhereOperator.isLt, value: 10 } });
    });
  });

  describe('isLte', () => {
    it('should add an "isLte" condition to the current Where clause', () => {
      where.valueOf('key').isLte(10);

      expect(where.result).toEqual({ key: { operator: WhereOperator.isLte, value: 10 } });
    });
  });

  describe('isGt', () => {
    it('should add an "isGt" condition to the current Where clause', () => {
      where.valueOf('key').isGt(10);

      expect(where.result).toEqual({ key: { operator: WhereOperator.isGt, value: 10 } });
    });
  });

  describe('isGte', () => {
    it('should add an "isGte" condition to the current Where clause', () => {
      where.valueOf('key').isGte(10);

      expect(where.result).toEqual({ key: { operator: WhereOperator.isGte, value: 10 } });
    });
  });

  describe('isInRange', () => {
    it('should add an "isInRange" condition to the current Where clause', () => {
      where.valueOf('key').isInRange([10, 20]);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isInRange, value: [10, 20] },
      });
    });
  });

  describe('isNotInRange', () => {
    it('should add an "isNotInRange" condition to the current Where clause', () => {
      where.valueOf('key').isNotInRange([10, 20]);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNotInRange, value: [10, 20] },
      });
    });
  });

  describe('isNotIn', () => {
    it('should add an "isNotIn" condition to the current Where clause', () => {
      where.valueOf('key').isNotIn(['value1', 'value2']);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNotIn, value: ['value1', 'value2'] },
      });
    });
  });

  describe('isNoneOf', () => {
    it('should add an "isNoneOf" condition to the current Where clause', () => {
      where.valueOf('key').isNoneOf(['value1', 'value2']);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNoneOf, value: ['value1', 'value2'] },
      });
    });
  });

  describe('isTrue', () => {
    it('should add an "isTrue" condition to the current Where clause', () => {
      where.valueOf('key').isTrue();

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isTrue, value: true },
      });
    });
  });

  describe('isFalse', () => {
    it('should add an "isFalse" condition to the current Where clause', () => {
      where.valueOf('key').isFalse();

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isFalse, value: false },
      });
    });
  });

  describe('is0', () => {
    it('should add an "is0" condition to the current Where clause', () => {
      where.valueOf('key').is0(0);

      expect(where.result).toEqual({ key: { operator: WhereOperator.is0, value: 0 } });
    });
  });

  describe('is1', () => {
    it('should add an "is1" condition to the current Where clause', () => {
      where.valueOf('key').is1(1);

      expect(where.result).toEqual({ key: { operator: WhereOperator.is1, value: 1 } });
    });
  });

  describe('isNull', () => {
    it('should add an "isNull" condition to the current Where clause', () => {
      where.valueOf('key').isNull(null);

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNull, value: null },
      });
    });
  });

  describe('isNotNull', () => {
    it('should add an "isNotNull" condition to the current Where clause', () => {
      where.valueOf('key').isNotNull('value');

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNotNull, value: 'value' },
      });
    });
  });

  describe('isEmpty', () => {
    it('should add an "isEmpty" condition to the current Where clause', () => {
      where.valueOf('key').isEmpty('');

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isEmpty, value: '' },
      });
    });
  });

  describe('isNotEmpty', () => {
    it('should add an "isNotEmpty" condition to the current Where clause', () => {
      where.valueOf('key').isNotEmpty('value');

      expect(where.result).toEqual({
        key: { operator: WhereOperator.isNotEmpty, value: 'value' },
      });
    });
  });

  describe('and', () => {
    it('should create an "AND" condition for a group of Where clauses', () => {
      const condition1 = new Where().valueOf('key1').isEq('value1');
      const condition2 = new Where().valueOf('key2').isEq('value2');
      const condition3 = new Where().valueOf('key3').isEq('value3');

      const combinedCondition = Where.and([condition1, condition2, condition3]);

      expect(combinedCondition).toEqual({
        and: [condition1.result, condition2.result, condition3.result],
      });
    });
  });

  describe('or', () => {
    it('should create an "OR" condition for a group of Where clauses', () => {
      const condition1 = new Where().valueOf('key1').isEq('value1').valueOf('key2').isNotEq(1);
      const condition2 = new Where().valueOf('key2').isEq('value2');
      const condition3 = new Where().valueOf('key3').isEq('value3');

      const combinedCondition = Where.or([condition1, condition2, condition3]);

      expect(combinedCondition).toEqual({
        or: [condition1.result, condition2.result, condition3.result],
      });
    });
  });
});
