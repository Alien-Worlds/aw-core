import { Failure } from '../../domain/failure';
import {
  AggregationParams,
  CountParams,
  FindParams,
  RemoveParams,
  UpdateMethod,
  UpdateParams,
} from '../../domain/queries';
import { Result } from '../../domain/result';
import { Where } from '../../domain/where/where';
import { DataSource } from '../data.source';
import { Mapper } from '../mapper';
import { QueryBuilders } from '../query-builders';
import { RepositoryImpl } from '../repository-impl';

describe('RepositoryImpl', () => {
  let repository: RepositoryImpl<unknown, unknown>;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockMapper: jest.Mocked<Mapper>;
  let mockQueryBuilders: jest.Mocked<QueryBuilders>;

  beforeEach(() => {
    mockDataSource = {
      aggregate: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      insert: jest.fn(),
      count: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    mockMapper = {
      toEntity: jest.fn(),
      fromEntity: jest.fn(),
      getEntityKeyMapping: jest.fn(),
    } as any;
    mockQueryBuilders = {
      buildAggregationQuery: jest.fn(),
      buildFindQuery: jest.fn(),
      buildUpdateQuery: jest.fn(),
      buildRemoveQuery: jest.fn(),
      buildCountQuery: jest.fn(),
    } as any;

    repository = new RepositoryImpl(mockDataSource, mockMapper, mockQueryBuilders);
  });

  describe('aggregate', () => {
    it('should perform the aggregation and return a result', async () => {
      const testParams = AggregationParams.create({
        average: 'filed1',
        count: 'filed2',
        groupBy: ['filed3'],
      });
      const expectedQuery = { count: 'field1' };
      const expected = [{ name: 'Foo' }];

      mockQueryBuilders.buildAggregationQuery.mockReturnValue(expectedQuery);
      mockDataSource.aggregate.mockResolvedValueOnce(expected);
      mockMapper.toEntity.mockImplementation(x => x);

      const result = await (repository as any).aggregate(testParams);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.aggregate).toHaveBeenCalledWith(expectedQuery);
      expect(mockMapper.toEntity).toHaveBeenCalledWith(...expected);

      mockMapper.toEntity.mockReset();
      mockDataSource.aggregate.mockResolvedValueOnce([expected]);

      await (repository as any).aggregate(testParams);

      expect(mockMapper.toEntity).toBeCalledTimes(1);
    });

    it('should call the build method when a custom builder is given', async () => {
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;

      await (repository as any).aggregate(mockQueryBuilder);
      expect(mockQueryBuilder.build).toHaveBeenCalled();
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;
      mockDataSource.aggregate.mockRejectedValue(mockError);

      const result = await (repository as any).aggregate(mockQueryBuilder);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });

  describe('update', () => {
    it('should perform the update and return a result', async () => {
      const testParams = new UpdateParams(
        [{ id: 1, name: 'Entity 1' }],
        [Where.is({})],
        [UpdateMethod.UpdateOne]
      );
      const expected = {
        status: 'success',
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedIds: [],
      };
      const expectedQuery = { id: 1, name: 'Entity 1' };
      mockQueryBuilders.buildUpdateQuery.mockReturnValue(expectedQuery);
      mockDataSource.update.mockResolvedValueOnce(expected);

      const result = await repository.update(testParams);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.update).toHaveBeenCalledWith(expectedQuery);
    });

    it('should call the build method when a custom builder is given', async () => {
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;

      await repository.update(mockQueryBuilder);
      expect(mockQueryBuilder.build).toHaveBeenCalled();
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;
      mockDataSource.update.mockRejectedValue(mockError);

      const result = await repository.update(mockQueryBuilder);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });

  describe('remove', () => {
    it('should perform the remove and return a result', async () => {
      const testParams = new RemoveParams();
      const expected = {
        status: 'success',
        deletedCount0: 1,
      };
      const expectedQuery = { where: { name: 'foo' } };
      mockQueryBuilders.buildRemoveQuery.mockReturnValue(expectedQuery);
      mockDataSource.remove.mockResolvedValueOnce(expected);

      const result = await repository.remove(testParams);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.remove).toHaveBeenCalledWith(expectedQuery);
    });

    it('should call the build method when a custom builder is given', async () => {
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;

      await repository.remove(mockQueryBuilder);
      expect(mockQueryBuilder.build).toHaveBeenCalled();
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;
      mockDataSource.remove.mockRejectedValue(mockError);

      const result = await repository.remove(mockQueryBuilder);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });

  describe('count', () => {
    it('should perform the count and return a result', async () => {
      const testParams = CountParams.create({
        sort: { field1: 1 },
        where: Where.is({ name: 'foo' }),
      });
      const expected = 1;
      const expectedQuery = { sort: { filed1: 1 }, where: { name: 'foo' } };

      mockQueryBuilders.buildCountQuery.mockReturnValue(expectedQuery);
      mockDataSource.count.mockResolvedValueOnce(expected);

      const result = await repository.count(testParams);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.count).toHaveBeenCalledWith(expectedQuery);
    });

    it('should call the build method when a custom builder is given', async () => {
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;

      await repository.count(mockQueryBuilder);
      expect(mockQueryBuilder.build).toHaveBeenCalled();
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;
      mockDataSource.count.mockRejectedValue(mockError);

      const result = await repository.count(mockQueryBuilder);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });

  describe('find', () => {
    it('should perform the find and return a result', async () => {
      const testParams = FindParams.create({ limit: 10, offset: 1 });
      const expected = [{ id: 1, name: 'Entity 1' }];
      const expectedQuery = { limit: 10, offset: 1 };

      mockQueryBuilders.buildFindQuery.mockReturnValue(expectedQuery);
      mockDataSource.find.mockResolvedValueOnce(expected);
      mockMapper.toEntity.mockImplementation(document => expected[0]);
      const result = await repository.find(testParams);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.find).toHaveBeenCalledWith(expectedQuery);
      expect(mockMapper.toEntity).toHaveBeenCalledTimes(expected.length);
    });

    it('should call the build method when a custom builder is given', async () => {
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;

      await repository.find(mockQueryBuilder);
      expect(mockQueryBuilder.build).toHaveBeenCalled();
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const mockQueryBuilder = {
        with: jest.fn(),
        build: jest.fn().mockReturnValue({ name: 'foo' }),
      } as any;
      mockDataSource.find.mockRejectedValue(mockError);

      const result = await repository.find(mockQueryBuilder);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });

  describe('add', () => {
    it('should add the entities and return a result', async () => {
      const testEntities = [{ id: 1, name: 'Entity 1' }];
      const testDocuments = [{ _id: 1, name: 'Entity 1' }];
      const expected = [{ id: 1, name: 'Entity 1' }];

      mockDataSource.insert.mockResolvedValueOnce(testDocuments);
      mockMapper.toEntity.mockImplementation(document => testEntities[0]);
      mockMapper.fromEntity.mockImplementation(entity => testDocuments[0]);

      const result = await repository.add(testEntities);

      expect(result).toEqual(Result.withContent(expected));
      expect(mockDataSource.insert).toHaveBeenCalledWith(testDocuments);
      expect(mockMapper.toEntity).toHaveBeenCalledTimes(testDocuments.length);
    });

    it('should return Result.withFailure on error', async () => {
      const mockError = new Error('Mocked error');
      const testEntities = [{ id: 1, name: 'Entity 1' }];

      mockDataSource.insert.mockRejectedValue(mockError);

      const result = await repository.add(testEntities);

      expect(result).toEqual(Result.withFailure(Failure.fromError(mockError)));
    });
  });
});
