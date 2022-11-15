import { BigQuery, Table } from '@google-cloud/bigquery';
import { CollectionBigQuerySource } from '../collection.bigquery.source';

const tableMock = {
  query: jest.fn(),
  insert: jest.fn(),
}

jest.mock('@google-cloud/bigquery', () => {
  return {
    BigQuery: jest.fn().mockImplementation(() => {
      return {
        dataset: (dataset: string, options: unknown) => ({
          table: (table: string) => tableMock
        })
      };
    }),
  };
});

const options = { tableName: 'foo_table', projectId: 'project_foo', datasetId: 'dataset_foo', primaryKey: 'id' };

describe('CollectionBigQuerySource Unit tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  
  it('collectionName should be equal options.tableId', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    expect(source.collectionName).toEqual(options.tableName)
  });

  it('findOne should return single row', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }], []])
    const result = await source.findOne({ where: '' });
    expect(result).toEqual({ foo: 1 })
  });

  it('count should return number of rows in the table', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([ [ { total_rows: 6 } ] ])
    const result = await source.count();
    expect(result).toEqual(6)
  });

  it('find should return rows', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }, { foo: 2 }], []])
    const result = await source.find({ where: '' });
    expect(result).toEqual([{ foo: 1 }, { foo: 2 }])
  });

  it('insert should call client insert and return row', async () => {
    const client: BigQuery = new BigQuery();
    tableMock.insert.mockResolvedValue([ { kind: 'bigquery#tableDataInsertAllResponse' } ])
    const source = new CollectionBigQuerySource(client, options);
    const result = await source.insert({foo: 1});
    expect(tableMock.insert).toBeCalled();
    expect(result).toEqual({foo:1});
  });

  it('insertMany should call client insert and return rows', async () => {
    const client: BigQuery = new BigQuery();
    tableMock.insert.mockResolvedValue([ { kind: 'bigquery#tableDataInsertAllResponse' } ])
    const source = new CollectionBigQuerySource(client, options);
    const result = await source.insertMany([{foo: 1}, {foo: 2}]);
    expect(tableMock.insert).toBeCalled();
    expect(result).toEqual([{foo: 1}, {foo: 2}]);
  });
});
