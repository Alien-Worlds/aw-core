import { Db, MongoClient } from 'mongodb';
import { MongoConfig } from '../config';

/**
 * This function builds a MongoDB URL from a MongoConfig object.
 * It takes the host, user, password, port, authMechanism and ssl
 * properties of the MongoConfig object and uses them to build the URL.
 */
export const buildMongoUrl = (config: MongoConfig) => {
  const { user, password, authMechanism, ssl, replicaSet, srv, authSource } = config;
  let url = srv ? 'mongodb+srv://' : 'mongodb://';
  const options = {};

  if (user && password) {
    url += `${user}:${password}@`;
    options['authMechanism'] = authMechanism || 'DEFAULT';
  }
  const hosts = config.hosts || ['localhost'];
  const ports = config.ports || ['27017'];
  const hostsPortsDiff = hosts.length - ports.length;
  const defaultPort = ports[0];
  while (hostsPortsDiff > 0) {
    ports.push(defaultPort);
  }

  const hostsAndPorts = hosts.map((host, i) => {
    return `${host}:${ports[i]}`;
  });

  url += hostsAndPorts.join(',');

  if (ssl) {
    options['ssl'] = true;
  }

  if (authSource) {
    options['authSource'] = authSource;
  }

  if (replicaSet) {
    options['replicaSet'] = replicaSet;
  }

  const params = Object.keys(options).reduce((list, key) => {
    list.push(`${key}=${options[key]}`);
    return list;
  }, []);

  if (params.length > 0) {
    url += `/?${params.join('&')}`;
  }

  return url;
};

/**
 * Connect to mongo database
 *
 * @async
 * @param {MongoConfig} config
 * @returns {Db} - database instance
 */
export const connectMongo = async (config: MongoConfig): Promise<Db> => {
  const { database } = config;
  const client = new MongoClient(buildMongoUrl(config));

  await client.connect();
  return client.db(database);
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
