import { ConfigVars } from '../config';
import { BroadcastConfig } from './broadcast.types';

export const buildBroadcastConfig = (
  configVars: ConfigVars,
  prefix = ''
): BroadcastConfig => {
  const p = prefix
    ? prefix.endsWith('_')
      ? prefix.toUpperCase()
      : prefix.toUpperCase() + '_'
    : '';
  return {
    port: configVars.getNumberEnv(`${p}BROADCAST_PORT`),
    host: configVars.getStringEnv(`${p}BROADCAST_HOST`),
    driver: configVars.getStringEnv(`${p}BROADCAST_DRIVER`),
    clientName: configVars.getStringEnv(`${p}BROADCAST_CLIENT_NAME`),
  };
};
