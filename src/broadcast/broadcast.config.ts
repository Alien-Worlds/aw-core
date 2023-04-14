import { ConfigVars } from '../config';
import { BroadcastConfig } from './broadcast.types';

export const buildBroadcastConfig = (
  configVars: ConfigVars,
  prefix = ''
): BroadcastConfig => ({
  port: configVars.getNumberEnv(`${prefix.toUpperCase()}BROADCAST_PORT`),
  host: configVars.getStringEnv(`${prefix.toUpperCase()}BROADCAST_HOST`),
  driver: configVars.getStringEnv(`${prefix.toUpperCase()}BROADCAST_DRIVER`),
  clientName: configVars.getStringEnv(`${prefix.toUpperCase()}BROADCAST_CLIENT_NAME`),
});
