/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import * as mongoDB from 'mongodb';
import { CollectionMongoSource } from '../collection.mongo.source';
import { MongoSource } from '../mongo.source';
import { DataSourceBulkWriteError, DataSourceOperationError } from '../storage.errors';

jest.mock('mongodb');
let findMock;
let countMock;
let deleteOneMock;
let deleteManyMock;
let aggregateMock;
let findOneMock;
let updateOneMock;
let updateManyMock;
let bulkWriteMock;
let insertOneMock;
let insertManyMock;
let listIndexesMock = { toArray: jest.fn() };
let collectionSource: CollectionMongoSource<any>;
const db = {
  databaseName: 'TestDB',
  collection: jest.fn(() => ({
    find: jest.fn(() => findMock()),
    countDocuments: jest.fn(() => countMock()),
    aggregate: jest.fn(() => aggregateMock()),
    findOne: jest.fn(() => findOneMock()),
    bulkWrite: jest.fn(() => bulkWriteMock()),
    updateOne: jest.fn(() => updateOneMock()),
    updateMany: jest.fn(() => updateManyMock()),
    insertOne: jest.fn(() => insertOneMock()),
    insertMany: jest.fn(() => insertManyMock()),
    deleteOne: jest.fn(() => deleteOneMock()),
    deleteMany: jest.fn(() => deleteManyMock()),
    listIndexes: jest.fn(() => listIndexesMock),
  })) as any,
};

const mongoSource = new MongoSource(db as mongoDB.Db);

const options = {}

describe('CollectionMongoSource Unit tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    collectionSource = new CollectionMongoSource<any>(mongoSource, 'test', options);
  });

  afterEach(() => {
    findMock = null;
    countMock = null;
    aggregateMock = null;
    deleteOneMock = null;
    deleteManyMock = null;
    findOneMock = null;
    updateOneMock = null;
    insertOneMock = null;
    insertManyMock = null;
  });

  it('Should throw an error if no additional indexes are set when checkIndexes option is true', async () => {
    listIndexesMock.toArray.mockResolvedValue([1]);
    try {
      let coll = new CollectionMongoSource<any>(mongoSource, 'test', { skipIndexCheck: false });
      await coll.validate();

      coll = new CollectionMongoSource<any>(mongoSource, 'test');
      await coll.validate();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('"removeMany" should convert documents list to the objectId list', async () => {
    const expectedResult = true;
    deleteManyMock = () => ({ deletedCount: 2 });
    const result = await collectionSource.removeMany([
      { _id: 'foo'}, { _id: new mongoDB.ObjectId('bar')}
    ]);

    expect(result).toEqual(expectedResult);
  });


  it('"removeMany" should return true when deletion was successful', async () => {
    const expectedResult = true;
    deleteManyMock = () => ({ deletedCount: 1 });
    const result = await collectionSource.removeMany({});

    expect(result).toEqual(expectedResult);
  });

  it('"removeMany" should return false when document was not found and removeManyd', async () => {
    const expectedResult = false;
    deleteManyMock = () => ({ deletedCount: 0 });
    const result = await collectionSource.removeMany({});

    expect(result).toEqual(expectedResult);
  });

  it('"removeMany" should throw an error when fetching has failed', async () => {
    deleteManyMock = () => {
      throw new Error('deleteMany error');
    };
    try {
      await collectionSource.removeMany({});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"remove" should return true when deletion was successful', async () => {
    const expectedResult = true;
    deleteOneMock = () => ({ deletedCount: 1 });
    const result = await collectionSource.remove({});

    expect(result).toEqual(expectedResult);
  });

  it('"remove" should return false when document was not found and removed', async () => {
    const expectedResult = false;
    deleteOneMock = () => ({ deletedCount: 0 });
    const result = await collectionSource.remove({});

    expect(result).toEqual(expectedResult);
  });

  it('"remove" should throw an error when fetching has failed', async () => {
    deleteOneMock = () => {
      throw new Error('deleteOne error');
    };
    try {
      await collectionSource.remove({});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"find" should return DTOs', async () => {
    const expectedResult = [{ foo: 1 }, { foo: 2 }];
    findMock = () => ({
      sort: jest.fn(() => findMock()),
      limit: jest.fn(() => findMock()),
      skip: jest.fn(() => findMock()),
      toArray: () => expectedResult,
    });
    const result = await collectionSource.find({filter: {}, options: { sort: 1, skip: 1, limit: 2 }});

    expect(result).toEqual(expectedResult);
  });

  it('"find" should throw an error when fetching has failed', async () => {
    findMock = () => {
      throw new Error('find error');
    };
    try {
      await collectionSource.find({filter:{}});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"count" should return a number', async () => {
    const expectedResult = 1;
    countMock = () => expectedResult;
    const result = await collectionSource.count({filter: {}, options: {}});

    expect(result).toEqual(expectedResult);
  });

  it('"count" should throw an error when fetching has failed', async () => {
    countMock = () => {
      throw new Error('count error');
    };
    try {
      await collectionSource.count({});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"aggregate" should return a list of dtos', async () => {
    const expectedResult = [{ foo: 1 }, { foo: 2 }];
    aggregateMock = () => ({
      toArray: () => expectedResult,
    });
    const result = await collectionSource.aggregate({pipeline: []});

    expect(result).toEqual(expectedResult);
  });

  it('"aggregate" should throw an error when fetching has failed', async () => {
    aggregateMock = () => {
      throw new Error('aggregate error');
    };
    try {
      await collectionSource.aggregate({pipeline: []});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"findOne" should return DTO', async () => {
    const expectedResult = { foo: 1 };
    findOneMock = () => expectedResult;
    const result = await collectionSource.findOne({filter:{}});

    expect(result).toEqual(expectedResult);
  });

  it('"findOne" should throw an error when fetching has failed', async () => {
    findOneMock = () => {
      throw new Error('findOne error');
    };
    try {
      await collectionSource.findOne({filter:{}});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"update" should call mongoDB updateOne and return DTO', async () => {
    const dto = { foo: 1 };
    updateOneMock = () => ({ upsertedId: 'foo' });
    const result = await collectionSource.update(dto);

    expect(result).toEqual(dto);
  });

  it('"update" should use provided UpdateFilter object', async () => {
    const dto: { foo?: number, bar?: number } = { foo: 1 };
    const where = { bar: 1 };
    updateOneMock = () => ({ modifiedCount: 1 });
    const result = await collectionSource.update(dto, {where});

    expect(result).toEqual(dto);
  });

  it('"update" should throw an error when operation has failed', async () => {
    updateOneMock = () => {
      throw new Error('update error');
    };
    try {
      await collectionSource.update({});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"updateMany" should call mongoDB updateMany and return DTO', async () => {
    const dto = { foo: 1 };
    bulkWriteMock = () => ({ modifiedCount: 1, upsertedCount: 0, upsertedIds: [] });
    const result = await collectionSource.updateMany([dto]);

    expect(result).toEqual({ modifiedCount: 1, upsertedCount: 0, upsertedIds: [] });
  });

  it('"updateMany" should throw an error when operation has failed', async () => {
    bulkWriteMock = () => {
      throw new Error('updateMany error');
    };
    try {
      await collectionSource.updateMany([]);
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"insert" should call mongoDB insertOne and return the string ID of the inserted document', async () => {
    const dto = { foo: 1 };
    insertOneMock = () => ({ insertedId: 'foo' });
    const result = await collectionSource.insert(dto);

    expect(result).toEqual({ _id: 'foo', foo: 1 });
  });

  it('"insert" should throw an error when operation has failed', async () => {
    insertOneMock = () => {
      throw new Error('insert error');
    };
    try {
      await collectionSource.insert({});
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });

  it('"insertMany" should call mongoDB insertManyOne and return the string ID of the inserted document', async () => {
    const dto = { foo: 1 };
    insertManyMock = () => ({ insertedIds: ['foo'] });
    const result = await collectionSource.insertMany([dto]);

    expect(result).toEqual([{ _id: 'foo', foo: 1 }]);
  });

  it('"insertMany" should throw an error when operation has failed', async () => {
    insertManyMock = () => {
      throw new Error('insertMany error');
    };
    try {
      await collectionSource.insertMany([{}]);
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceBulkWriteError);
    }
  });

  it('"bulkWrite" should return operation result object', async () => {
    const expectedResult = {
      insertedCount: 0, 
      result: {
        ok: 1,
        writeErrors: [],
        writeConcernErrors: [],
        insertedIds: [],
        nInserted: 0,
        nUpserted: 0,
        nMatched: 0,
        nModified: 0,
        nRemoved: 0,
        upserted: [],
      }
    };
    bulkWriteMock = () => expectedResult;
    const result = await collectionSource.composedOperation([]);

    expect(result).toEqual(expectedResult);
  });

  it('"bulkWrite" should throw an error when operation has failed', async () => {
    bulkWriteMock = () => {
      throw new Error('bulkWrite error');
    };
    try {
      await collectionSource.composedOperation([]);
    } catch (error) {
      expect(error).toBeInstanceOf(DataSourceOperationError);
    }
  });
});