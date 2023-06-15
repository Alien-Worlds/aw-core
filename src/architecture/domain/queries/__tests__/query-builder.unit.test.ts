import { QueryBuilder } from '../query-builder'; // Path should match the actual location of your QueryBuilder class.

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

      // Due to private property, we need to use with method to access it indirectly
      queryBuilder.with(args);

      const resultQuery = queryBuilder.with({ anotherArg: 'arg' });

      expect(resultQuery).toBeInstanceOf(QueryBuilder);

      // Note: This won't actually test the assignment to `args` as it's private,
      // in a real scenario, you would test it indirectly, likely via the behavior of the `build()` method.
    });
  });

  describe('build()', () => {
    it('should throw an error', () => {
      expect(() => queryBuilder.build()).toThrowError('Method not implemented.');
    });
  });
});
