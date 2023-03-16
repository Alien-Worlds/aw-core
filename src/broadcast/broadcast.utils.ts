import { log } from '../utils';
import { BroadcastAmqClient } from './amq/broadcast.amq.client';
import { BroadcastErrorType } from './broadcast.enums';
import { BroadcastOptions } from './broadcast.types';

/**
 *
 * @param {ProcessorConfig} config
 * @param {BroadcastMessageMapper} broadcastMessageMapper
 * @returns { Broadcast }
 */
export const setupBroadcast = async (
  url: string,
  options: BroadcastOptions
): Promise<BroadcastAmqClient> => {
  const broadcastClient = new BroadcastAmqClient(url, options, console);

  broadcastClient.onError(error => {
    if (error.type === BroadcastErrorType.SendError) {
      log(error.message);
    }
  });

  await broadcastClient.init();

  return broadcastClient;
};
