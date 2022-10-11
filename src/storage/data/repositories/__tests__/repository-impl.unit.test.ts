/* eslint-disable @typescript-eslint/no-explicit-any */

import { Failure } from "../../../../architecture/domain/failure";
import { QueryModel } from "../../../../architecture/domain/query-model";
import { EntityNotFoundError } from "../../../domain/errors/entity-not-found.error";
import { CollectionMongoSource } from "../../data-sources/collection.mongo.source";
import { Mapper } from "../../mappers/mapper";
import { MongoDeleteQueryParams } from "../../mongo.types";
import { RepositoryImpl } from "../repository-impl";
import { FakeDocument, FakeEntity } from "./fixtures/fake.entity";


export class TestQueryModel
  implements QueryModel<MongoDeleteQueryParams<FakeDocument>>
{
  toQueryParams(): MongoDeleteQueryParams<FakeDocument> {
    return {
      filter: { account: 'foo' },
    };
  }
}

let repository: RepositoryImpl<FakeEntity, FakeDocument>;
const source: CollectionMongoSource<FakeDocument> = {
  aggregate: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  removeMany: jest.fn(),
  remove: jest.fn(),
} as any;

const mapper = {
  createDocumentFromEntity: (entity: FakeEntity) => jest.fn(),
  createEntityFromDocument: (document: FakeDocument) => jest.fn(),
}

const dto: { _id?: string, data?: string } = {
  _id: '',
  data: 'fake data',
};

const findModel = { toQueryParams: () => ({ filter: {}, options: {} }) } as any;
const aggregateModel = {
  toQueryParams: () => ({ pipeline: [], options: {} }),
} as any;

describe('RepositoryImpl unit tests', () => {
  it('"find" should return failure when no documents were found', async () => {
    const findMock = jest.spyOn(source, 'find').mockResolvedValue([]);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.find(findModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(EntityNotFoundError);

    findMock.mockClear();
  });

  it('"find" should return failure when source throws error', async () => {
    const findMock = jest
      .spyOn(source, 'find')
      .mockRejectedValue(new Error(''));
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.find(findModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(Error);

    findMock.mockClear();
  });

  it('"find" should return data object', async () => {
    const findMock = jest.spyOn(source, 'find').mockResolvedValue([dto]);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.find(findModel);
    expect(result.content).toBeInstanceOf(Array);
    expect(result.failure).toBeUndefined();

    findMock.mockClear();
  });

  //
  it('"findOne" should return failure when no documents were found', async () => {
    const findOneMock = jest.spyOn(source, 'findOne').mockResolvedValue(null);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.findOne(findModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(EntityNotFoundError);

    findOneMock.mockClear();
  });

  it('"findOne" should return failure when source throws error', async () => {
    const findOneMock = jest
      .spyOn(source, 'findOne')
      .mockRejectedValue(new Error(''));
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.findOne(findModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(Error);

    findOneMock.mockClear();
  });

  it('"findOne" should return data object', async () => {
    const findOneMock = jest.spyOn(source, 'findOne').mockResolvedValue(dto as any);
    const createEntityMock = jest
      .spyOn(mapper, 'createEntityFromDocument')
      .mockImplementation(() => FakeEntity.create('', dto.data) as any);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.findOne(findModel);
    expect(result.content).toBeInstanceOf(FakeEntity);
    expect(result.failure).toBeUndefined();

    findOneMock.mockClear();
    createEntityMock.mockClear();
  });

  it('"aggregate" should return failure when no documents were found', async () => {
    const aggregateMock = jest.spyOn(source, 'aggregate').mockResolvedValue([]);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.aggregate(aggregateModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(EntityNotFoundError);

    aggregateMock.mockClear();
  });

  it('"aggregate" should return failure when source throws error', async () => {
    const aggregateMock = jest
      .spyOn(source, 'aggregate')
      .mockRejectedValue(new Error(''));
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.aggregate(aggregateModel);
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(Error);

    aggregateMock.mockClear();
  });

  it('"aggregate" should return data object', async () => {
    const aggregateMock = jest
      .spyOn(source, 'aggregate')
      .mockResolvedValue([dto]);
    const createEntityMock = jest
      .spyOn(mapper, 'createEntityFromDocument')
      .mockImplementation(() => FakeEntity.create('', dto.data) as any);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.aggregate(aggregateModel);
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content[0]).toEqual(FakeEntity.fromDocument(dto));
    expect(result.failure).toBeUndefined();

    aggregateMock.mockClear();
    createEntityMock.mockClear();
  });

  it('"add" should return failure when source throws error', async () => {
    const addMock = jest
      .spyOn(source, 'insert')
      .mockRejectedValue(new Error(''));
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.add(FakeEntity.fromDocument(dto));
    expect(result.content).toBeUndefined();
    expect(result.failure.error).toBeInstanceOf(Error);

    addMock.mockClear();
  });

  it('"add" should return data object', async () => {
    const fakeId = 'fake_id';
    const addMock = jest.spyOn(source, 'insert').mockResolvedValue(fakeId);
    const createEntityMock = jest.spyOn(mapper, 'createEntityFromDocument')
      .mockImplementation(() => FakeEntity.create(fakeId, dto.data) as any);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.add(FakeEntity.fromDocument(dto));
    expect(result.content).toEqual(FakeEntity.create(fakeId, dto.data) as any);
    expect(result.failure).toBeUndefined();

    addMock.mockClear();
    createEntityMock.mockClear();
  });

  it('"remove" should call remove and use dto data as a filter', async () => {
    const addMock = jest.spyOn(source, 'remove').mockResolvedValue(true);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.remove(new TestQueryModel());
    expect(result.content).toEqual(true);
    expect(result.failure).toBeUndefined();

    addMock.mockClear();
  });

  it('"remove" should remove element with given id', async () => {
    const addMock = jest.spyOn(source, 'remove').mockResolvedValue(true);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.remove({ _id: 'fake_id' });
    expect(result.content).toEqual(true);
    expect(result.failure).toBeUndefined();

    addMock.mockClear();
  });

  it('"remove" should return Failure when removing document fails', async () => {
    const addMock = jest.spyOn(source, 'remove').mockRejectedValue(new Error());
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.remove({ _id: 'fake_id' });
    expect(result.failure).toBeInstanceOf(Failure);

    addMock.mockClear();
  });

  it('"removeMany" should call remove and use dto data as a filter', async () => {
    const addMock = jest.spyOn(source, 'removeMany').mockResolvedValue(true);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.removeMany(new TestQueryModel());
    expect(result.content).toEqual(true);
    expect(result.failure).toBeUndefined();

    addMock.mockClear();
  });

  it('"removeMany" should remove element with given id', async () => {
    const addMock = jest.spyOn(source, 'removeMany').mockResolvedValue(true);
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.removeMany([{ _id: 'fake_id' }]);
    expect(result.content).toEqual(true);
    expect(result.failure).toBeUndefined();

    addMock.mockClear();
  });

  it('"removeMany" should return Failure when removing document fails', async () => {
    const addMock = jest.spyOn(source, 'removeMany').mockRejectedValue(new Error());
    repository = new RepositoryImpl(source, mapper as any);

    const result = await repository.removeMany([{ _id: 'fake_id' }]);
    expect(result.failure).toBeInstanceOf(Failure);

    addMock.mockClear();
  });
});
