import { ConfigVars } from '../../config';
import { MongoConfig } from './mongo.types';

export const buildMongoConfig = (configVars: ConfigVars): MongoConfig => ({
  database: configVars.getStringEnv('MONGO_DB_NAME'),
  hosts: configVars.getArrayEnv('MONGO_HOSTS'),
  ports: configVars.getArrayEnv('MONGO_PORTS'),
  user: configVars.getStringEnv('MONGO_USER'),
  password: configVars.getStringEnv('MONGO_PASSWORD'),
  authMechanism: configVars.getStringEnv('AUTH_MECHANISM'),
  authSource: configVars.getStringEnv('AUTH_SOURCE'),
  replicaSet: configVars.getStringEnv('REPLICA_SET'),
  ssl: configVars.getBooleanEnv('SSL'),
  srv: configVars.getBooleanEnv('SRV'),
});
