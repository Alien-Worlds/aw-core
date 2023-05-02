import { ConfigVars } from '../../config';
import { RedisConfig } from './redis.types';

export const buildRedisConfig = (configVars: ConfigVars, prefix = ''): RedisConfig => {
  const p = prefix
    ? prefix.endsWith('_')
      ? prefix.toUpperCase()
      : prefix.toUpperCase() + '_'
    : '';
  return {
    database: configVars.getStringEnv(`${p}REDIS_DB_NAME`),
    hosts: configVars.getArrayEnv(`${p}REDIS_HOSTS`),
    ports: configVars.getArrayEnv(`${p}REDIS_PORTS`),
    user: configVars.getStringEnv(`${p}REDIS_USER`),
    password: configVars.getStringEnv(`${p}REDIS_PASSWORD`),
    iana: configVars.getBooleanEnv(`${p}REDIS_IANA`),
  };
};
