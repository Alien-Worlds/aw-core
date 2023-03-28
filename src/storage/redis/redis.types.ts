export type RedisConfig = {
  hosts: string[];
  ports: string[];
  iana?: boolean;
  user?: string;
  password?: string;
  database?: string | number;
};

export type RedisSortedDocument = {
  rank: number;
  score: number;
  value: string;
};

export type RedisHashDocument = {
  [key: string]: string;
};

export * as Redis from 'redis';
