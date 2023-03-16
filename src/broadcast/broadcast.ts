import { nanoid } from 'nanoid';
import { BroadcastDriver } from './broadcast.enums';
import {
  BroadcastClient,
  BroadcastConfig,
  BroadcastMessage,
  BroadcastServer,
  ClientMessageHandler,
} from './broadcast.types';
import { BroadcastTcpClient } from './tcp';
import { BroadcastTcpServer } from './tcp/broadcast.tcp.server';

/**
 * @class
 */
export class Broadcast {
  public static async startServer(
    config: BroadcastConfig,
    messageHandler?: ClientMessageHandler<BroadcastMessage>
  ): Promise<BroadcastServer> {
    let server: BroadcastServer;
    if (config.driver === BroadcastDriver.Tcp) {
      server = new BroadcastTcpServer(config);

      if (messageHandler) {
        server.onClientMessage(messageHandler);
      }

      await server.start();
    }

    return server;
  }

  public static async createClient(config: BroadcastConfig): Promise<BroadcastClient> {
    const { driver, clientName } = config;
    let client: BroadcastClient;

    if (driver === BroadcastDriver.Tcp) {
      client = new BroadcastTcpClient(clientName || nanoid(), config);
    }

    return client;
  }
}
