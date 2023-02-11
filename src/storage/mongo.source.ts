import * as mongoDB from 'mongodb';
import { MongoConfig } from '../config';
import { buildMongoUrl } from './mongo.helpers';

/**
 * Represents MongoDB data source.
 * @class
 */
export class MongoSource {
  public static Token = 'MONGO_SOURCE';

  public static async create(config: MongoConfig): Promise<MongoSource> {
    const { database } = config;
    const client = new mongoDB.MongoClient(buildMongoUrl(config));

    await client.connect();

    return new MongoSource(client.db(database), client);
  }

  constructor(public database: mongoDB.Db, public client?: mongoDB.MongoClient) {}
}
