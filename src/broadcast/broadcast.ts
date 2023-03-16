import { BroadcastDriver } from './broadcast.enums';
import { BroadcastConfig, BroadcastServer } from './broadcast.types';
import { BroadcastTcpServer } from './tcp/broadcast.tcp.server';

/**
 * @class
 */
export class Broadcast {
  public static async startServer(config: BroadcastConfig): Promise<BroadcastServer> {
    let server: BroadcastServer;
    if (config.driver === BroadcastDriver.Tcp) {
      server = new BroadcastTcpServer(config);
      await server.start();
    }

    return server;
  }
}
