import { ConfigVars } from '../config';
import { BroadcastConfig } from './broadcast.types';

export const buildBroadcastConfig = (configVars: ConfigVars): BroadcastConfig => ({
  port: configVars.getNumberEnv('BROADCAST_PORT'),
  host: configVars.getStringEnv('BROADCAST_HOST'),
  driver: configVars.getStringEnv('BROADCAST_DRIVER'),
  clientName: configVars.getStringEnv('BROADCAST_CLIENT_NAME'),
});
