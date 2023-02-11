export type MongoConfig = {
  database: string;
  hosts: string[];
  ports?: string[];
  user?: string;
  password?: string;
  authMechanism?: string;
  authSource?: string;
  ssl?: boolean;
  replicaSet?: string;
  srv?: boolean;
};

export const mongoConfig: MongoConfig = {
  database: process.env.MONGO_DB_NAME,
  hosts: process.env.MONGO_HOSTS.split(/,\s*/),
  ports: process.env.MONGO_PORTS.split(/,\s*/),
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  authMechanism: process.env.AUTH_MECHANISM,
  authSource: process.env.AUTH_SOURCE,
  replicaSet: process.env.REPLICA_SET,
  ssl: Boolean(process.env.SSL),
  srv: Boolean(process.env.SRV),
};
