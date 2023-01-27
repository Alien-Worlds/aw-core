export type MongoConfig = {
  database: string;
  host: string;
  port?: number;
  user?: string;
  password?: string;
  authMechanism?: string;
  ssl?: boolean;
};

export const mongoConfig: MongoConfig = {
  database: process.env.MONGO_DB_NAME,
  host: process.env.MONGO_HOST,
  port: Number(process.env.MONGO_PORT),
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  authMechanism: process.env.AUTH_MECHANISM,
  ssl: Boolean(process.env.SSL),
};
