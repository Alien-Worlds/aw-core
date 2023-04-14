import { ConfigVars } from '../../config';
import { RedisConfig } from './redis.types';

export const buildRedisConfig = (configVars: ConfigVars): RedisConfig => ({
  database: configVars.getStringEnv('REDIS_DB_NAME'),
  hosts: configVars.getArrayEnv('REDIS_HOSTS'),
  ports: configVars.getArrayEnv('REDIS_PORTS'),
  user: configVars.getStringEnv('REDIS_USER'),
  password: configVars.getStringEnv('REDIS_PASSWORD'),
  iana: configVars.getBooleanEnv('REDIS_IANA'),
});
