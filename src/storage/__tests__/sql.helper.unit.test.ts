import { SqlQueryType } from '../sql.enums';
import { stringifyMultiCondition, stringifyData, buildSqlQuery } from '../sql.helpers';


describe('SQL helpers Unit tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('stringifyData should parse object into a comma separated key = value string', async () => {
      expect(stringifyData({foo: 1, bar: 2})).toEqual('foo = 1, bar = 2');
  });

  it('stringifyData should parse object to one key = value string', async () => {
    expect(stringifyData({foo: 1, bar: 2}, 'foo')).toEqual('foo = 1');
  });

  it('stringifyMultiCondition should parse object into a OR separated key:value string', async () => {
    expect(stringifyMultiCondition('OR', 'foo', [{foo: 1, bar: 2}, {foo: 2, bar: 3}])).toEqual('foo = 1 OR foo = 2');
  });

  it('buildSqlQuery should create SELECT sql query based on given params', async () => {
    expect(buildSqlQuery(SqlQueryType.Select,'foo',[],{ limit:1, offset: 1 })).toEqual('SELECT * FROM foo LIMIT 1 OFFSET 1');
  });
  
  it('buildSqlQuery should create COUNT sql query based on given params', async () => {
    expect(buildSqlQuery(SqlQueryType.Count,'foo',[])).toEqual('SELECT COUNT(*) AS total_rows FROM foo');
    expect(buildSqlQuery(SqlQueryType.Count,'foo',[], { where: 'bar = 1'})).toEqual('SELECT COUNT(*) AS total_rows FROM foo WHERE bar = 1');
  });

  it('buildSqlQuery should create UPDATE sql query based on given params', async () => {
    expect(buildSqlQuery(SqlQueryType.Update,'foo',[{bar:1}], { where: 'baz = 2' })).toEqual('UPDATE foo SET bar = 1 WHERE baz = 2');
  });

  it('buildSqlQuery should create DELETE sql query based on given params', async () => {
    expect(buildSqlQuery(SqlQueryType.Delete,'foo',[], { where: 'baz = 2' })).toEqual('DELETE FROM foo WHERE baz = 2');
  });

  it('buildSqlQuery should create INSERT sql query based on given params', async () => {
    expect(buildSqlQuery(SqlQueryType.Insert,'foo',[{foo: 1, bar: 2}, {foo: 3, bar: 4}])).toEqual('INSERT INTO foo (foo, bar) VALUES (1, 2), (3, 4)');
  });
});
