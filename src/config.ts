export type MongoConfig = {
  url: string;
  dbName: string;
};

export const mongoConfig: MongoConfig = {
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME,
};
