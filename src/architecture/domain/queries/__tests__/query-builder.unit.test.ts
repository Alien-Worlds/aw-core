import { QueryBuilder } from '../query-builder';

describe('QueryBuilder', () => {
  let queryBuilder;

  beforeEach(() => {
    queryBuilder = new QueryBuilder();
  });

  it('should be able to initialize', () => {
    expect(queryBuilder).toBeTruthy();
  });

  describe('with()', () => {
    it('should set the args correctly', () => {
      const args = { name: 'test', value: 123 };

      queryBuilder.with(args);

      const resultQuery = queryBuilder.with({ anotherArg: 'arg' });

      expect(resultQuery).toBeInstanceOf(QueryBuilder);
    });
  });

  describe('build()', () => {
    it('should throw an error', () => {
      expect(() => queryBuilder.build()).toThrowError('Method not implemented.');
    });
  });
});
