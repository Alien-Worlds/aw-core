export type RedisConfig = {
  hosts: string[];
  ports: string[];
  iana?: boolean;
  user?: string;
  password?: string;
  database?: string | number;
};

export * as Redis from 'redis';
