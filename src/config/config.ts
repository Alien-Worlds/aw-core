import { BroadcastConfig } from '../broadcast';
import { MongoConfig, RedisConfig } from '../storage';

export const mongoConfig: MongoConfig = {
  database: process.env.MONGO_DB_NAME,
  hosts: (process.env.MONGO_HOSTS || '').split(/,\s*/),
  ports: (process.env.MONGO_PORTS || '').split(/,\s*/),
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  authMechanism: process.env.AUTH_MECHANISM,
  authSource: process.env.AUTH_SOURCE,
  replicaSet: process.env.REPLICA_SET,
  ssl: Boolean(process.env.SSL),
  srv: Boolean(process.env.SRV),
};

export const redisConfig: RedisConfig = {
  database: process.env.REDIS_DB_NAME,
  hosts: (process.env.REDIS_HOSTS || '').split(/,\s*/),
  ports: (process.env.REDIS_PORTS || '').split(/,\s*/),
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  iana: Boolean(Number(process.env.REDIS_IANA)),
};

export const broadcastConfig: BroadcastConfig = {
  url: process.env.BROADCAST_URL,
  host: process.env.BROADCAST_HOST,
  port: Number(process.env.BROADCAST_PORT),
  driver: process.env.BROADCAST_DRIVER,
  clientName: process.env.BROADCAST_CLIENT_NAME,
};
