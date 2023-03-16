import { BigQuery } from '@google-cloud/bigquery';
import { CollectionBigQuerySource } from '../collection.bigquery.source';

const tableMock = {
  query: jest.fn(),
  insert: jest.fn(),
};

jest.mock('@google-cloud/bigquery', () => {
  return {
    BigQuery: jest.fn().mockImplementation(() => {
      return {
        dataset: (dataset: string, options: unknown) => ({
          table: (table: string) => tableMock,
        }),
      };
    }),
  };
});

const options = {
  tableName: 'foo_table',
  projectId: 'project_foo',
  datasetId: 'dataset_foo',
  primaryKey: 'id',
};

describe('CollectionBigQuerySource Unit tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('collectionName should be equal options.tableId', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    expect(source.collectionName).toEqual(options.tableName);
  });

  it('findOne should return single row', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }], []]);
    const result = await source.findOne({ where: '' });
    expect(result).toEqual({ foo: 1 });
  });

  it('findOne should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.findOne({ where: '' });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('count should return number of rows in the table', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ total_rows: 6 }]]);
    const result = await source.count();
    expect(result).toEqual(6);
  });

  it('count should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.count();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('find should return rows', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }, { foo: 2 }], []]);
    const result = await source.find({ where: '' });
    expect(result).toEqual([{ foo: 1 }, { foo: 2 }]);
  });

  it('find should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.find({ where: '' });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('update should update row and return data', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }], []]);

    let result = await source.update({ id: 'foo' });
    expect(result).toEqual({ id: 'foo' });

    result = await source.update({ id: 'foo' }, { where: 'id = "foo"' });
    expect(result).toEqual({ id: 'foo' });
  });

  it('update should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.update({ where: '' });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('updateMany should update rows and return update stats', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }], []]);

    let result = await source.updateMany([{ id: 'foo' }, { id: 'bar' }]);
    expect(result).toEqual({
      modifiedCount: 2,
      upsertedCount: 0,
      upsertedIds: [],
    });
  });

  it('updateMany should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.updateMany([{ id: 'foo' }, { id: 'bar' }]);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('insert should call client insert and return row', async () => {
    const client: BigQuery = new BigQuery();
    tableMock.insert.mockResolvedValue([{ kind: 'bigquery#tableDataInsertAllResponse' }]);
    const source = new CollectionBigQuerySource(client, options);
    const result = await source.insert({ foo: 1 });
    expect(tableMock.insert).toBeCalled();
    expect(result).toEqual({ foo: 1 });
  });

  it('insert should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.insert.mockRejectedValue(new Error());

    try {
      await source.insert({});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('insertMany should call client insert and return rows', async () => {
    const client: BigQuery = new BigQuery();
    tableMock.insert.mockResolvedValue([{ kind: 'bigquery#tableDataInsertAllResponse' }]);
    const source = new CollectionBigQuerySource(client, options);
    const result = await source.insertMany([{ foo: 1 }, { foo: 2 }]);
    expect(tableMock.insert).toBeCalled();
    expect(result).toEqual([{ foo: 1 }, { foo: 2 }]);
  });

  it('insertMany should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.insert.mockRejectedValue(new Error());

    try {
      await source.insertMany([{}]);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('remove should call client remove and return true', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }]]);
    const result = await source.remove({ foo: 1 });
    expect(result).toEqual(true);
  });

  it('remove should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.remove({});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('remove should throw an error when "where" arg is not provided', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.remove(null);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('removeMany should call client removeMany and return true', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockResolvedValue([[{ foo: 1 }]]);
    const result = await source.removeMany([{ foo: 1 }]);
    expect(result).toEqual(true);
  });

  it('removeMany should throw an error', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.removeMany([{}]);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('removeMany should throw an error when "where" arg is not provided', async () => {
    const client: BigQuery = new BigQuery();
    const source = new CollectionBigQuerySource(client, options);
    tableMock.query.mockRejectedValue(new Error());

    try {
      await source.removeMany(null);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
