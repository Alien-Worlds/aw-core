/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BigQuery, Table } from '@google-cloud/bigquery';
import {
  DataSourceOperationError,
  MissingArgumentsError,
} from '../../domain/storage.errors';
import { UpdateManyResult } from '../mongo.types';
import { SqlQueryType } from '../sql.enums';
import { CollectionSource } from './collection.source';
import { buildSqlQuery, stringifyData, stringifyMultiCondition } from './sql.helpers';

export type CollectionOptions = {
  projectId: string;
  datasetId: string;
  tableName: string;
  primaryKey: string;
  location?: string;
};

/**
 * Represents MongoDB data source.
 * @class
 */
export class CollectionBigQuerySource<DocumentType = unknown>
  implements CollectionSource<DocumentType>
{
  protected collection: Table;
  protected label: string;

  constructor(protected client: BigQuery, protected options: CollectionOptions) {
    const { projectId, datasetId, tableName } = options;
    this.label = `${projectId}.${datasetId}.${tableName}`;
    this.collection = this.client.dataset(datasetId, options).table(tableName);
  }

  public get collectionName(): string {
    return this.options.tableName;
  }

  public async findOne(params: { where?: string }): Promise<DocumentType> {
    try {
      const [rows]: [DocumentType[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Select, this.label, [], {
          where: params.where,
          limit: 1,
        })
      );

      return rows[0];
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }
  public async find(params: {
    where?: string;
    limit?: number;
    offset?: number;
  }): Promise<DocumentType[]> {
    try {
      const where = params.where ? ` WHERE ${params.where}` : '';
      const limit = params.limit ? ` LIMIT ${params.limit}` : '';
      const offset = params.offset ? ` OFFSET ${params.offset}` : '';
      const [rows]: [DocumentType[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Select, this.label, [], params)
      );

      return rows;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }
  public async count(params?: { where?: string }): Promise<number> {
    try {
      const [rows]: [{ total_rows: number }[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Count, this.label, [], params)
      );

      return rows[0].total_rows;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public aggregate(params: unknown): Promise<DocumentType[]> {
    throw new Error('Method not implemented.');
  }

  public async update(
    data: DocumentType,
    params?: { where: string }
  ): Promise<DocumentType> {
    try {
      const {
        options: { primaryKey },
      } = this;
      let where: string;
      if (params?.where) {
        where = params.where;
      } else if (!params?.where && data[primaryKey]) {
        where = `${primaryKey} = ${String(data[primaryKey])}`;
      } else {
        throw new MissingArgumentsError(`where or data.${primaryKey}`);
      }

      const [rows]: [DocumentType[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Update, this.label, [data], params)
      );

      return data;
    } catch (error) {
      // // if it doesn't exist, add
      //
      throw DataSourceOperationError.fromError(error);
    }
  }
  public async updateMany(
    data: DocumentType[],
    params?: { where: string }
  ): Promise<UpdateManyResult> {
    try {
      const result = {
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedIds: [],
      };
      for (const row of data) {
        try {
          await this.update(row, params);
          result.modifiedCount++;
        } catch (error) {
          // if it doesn't exist, add
        }
      }

      return {
        modifiedCount: data.length,
        upsertedCount: 0,
        upsertedIds: [],
      };
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async insert(data: DocumentType): Promise<DocumentType> {
    try {
      const result = await this.collection.insert(data);
      return result[0].kind === 'bigquery#tableDataInsertAllResponse' ? data : null;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async insertMany(dtos: DocumentType[]): Promise<DocumentType[]> {
    try {
      const result = await this.collection.insert(dtos);
      return result[0].kind === 'bigquery#tableDataInsertAllResponse' ? dtos : [];
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async remove(where: DocumentType | string): Promise<boolean> {
    try {
      if (!where) {
        throw new MissingArgumentsError('where');
      }
      const condition = typeof where === 'string' ? where : stringifyData(where);
      const [rows]: [DocumentType[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Delete, this.label, [], { where: condition })
      );
      return rows.length > 0;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async removeMany(where: DocumentType[] | string): Promise<boolean> {
    try {
      const {
        options: { primaryKey },
      } = this;
      const condition =
        typeof where === 'string'
          ? where
          : stringifyMultiCondition<DocumentType>('OR', primaryKey, where);

      if (!where || where.length === 0) {
        throw new MissingArgumentsError('where');
      }

      const [rows]: [DocumentType[], unknown] = await this.collection.query(
        buildSqlQuery(SqlQueryType.Delete, this.label, [], { where: condition })
      );
      return rows.length > 0;
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public composedOperation(operations: unknown[], options?: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
