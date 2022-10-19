import { Db, MongoClient } from 'mongodb';
import { MongoConfig } from '../../../config';

/**
 * Connect to mongo database
 *
 * @async
 * @param {MongoConfig} config
 * @returns {Db} - database instance
 */
export const connectMongo = async (config: MongoConfig): Promise<Db> => {
  const { url, dbName } = config;
  const client = new MongoClient(url);

  await client.connect();
  return client.db(dbName);
};

/**
 *
 * @param {string} url
 * @returns {Promise<MongoClient>}
 */
export const connectMongoClient = async (url: string): Promise<MongoClient> => {
  const client = new MongoClient(url);

  await client.connect();
  return client;
};

/**
 *
 * @param {MongoClient} client
 * @param {string} name
 * @returns {Db}
 */
export const getDatabase = (client: MongoClient, name: string): Db => client.db(name);
