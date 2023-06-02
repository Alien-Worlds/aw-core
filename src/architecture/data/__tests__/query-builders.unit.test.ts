import {
  FindParams,
  QueryBuilder,
  RemoveParams,
  UpdateParams,
} from '../../domain/queries';
import { Where } from '../../domain/where';
import { QueryBuilders } from '../query-builders';

describe('QueryBuilders', () => {
  let findQueryBuilder: QueryBuilder;
  let countQueryBuilder: QueryBuilder;
  let updateQueryBuilder: QueryBuilder;
  let removeQueryBuilder: QueryBuilder;
  let aggregationQueryBuilder: QueryBuilder;
  let queryBuilders: QueryBuilders;

  beforeEach(() => {
    findQueryBuilder = {
      build: jest.fn(),
    };

    countQueryBuilder = {
      build: jest.fn(),
    };

    updateQueryBuilder = {
      build: jest.fn(),
    };

    removeQueryBuilder = {
      build: jest.fn(),
    };

    aggregationQueryBuilder = {
      build: jest.fn(),
    };

    queryBuilders = new QueryBuilders(
      findQueryBuilder,
      countQueryBuilder,
      updateQueryBuilder,
      removeQueryBuilder,
      aggregationQueryBuilder
    );
  });

  describe('buildFindQuery', () => {
    it('should call findQueryBuilder.build', () => {
      const params = FindParams.create({});

      queryBuilders.buildFindQuery(params);

      expect(findQueryBuilder.build).toHaveBeenCalledWith(params);
    });
  });

  describe('buildCountQuery', () => {
    it('should call countQueryBuilder.build', () => {
      const params = {};

      queryBuilders.buildCountQuery(params);

      expect(countQueryBuilder.build).toHaveBeenCalledWith(params);
    });
  });

  describe('buildUpdateQuery', () => {
    it('should call updateQueryBuilder.build', () => {
      const params = UpdateParams.create([]);

      queryBuilders.buildUpdateQuery(params);

      expect(updateQueryBuilder.build).toHaveBeenCalledWith(params);
    });
  });

  describe('buildRemoveQuery', () => {
    it('should call removeQueryBuilder.build', () => {
      const params = RemoveParams.create(Where.is({}));

      queryBuilders.buildRemoveQuery(params);

      expect(removeQueryBuilder.build).toHaveBeenCalledWith(params);
    });
  });

  describe('buildAggregationQuery', () => {
    it('should call aggregationQueryBuilder.build', () => {
      const params = {};

      queryBuilders.buildAggregationQuery(params);

      expect(aggregationQueryBuilder.build).toHaveBeenCalledWith(params);
    });
  });
});
