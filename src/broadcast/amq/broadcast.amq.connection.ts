import * as Amq from 'amqplib';
import { log, wait } from '../../utils';
import { ConnectionState } from '../broadcast.enums';
import { ConnectionStateHandler } from '../broadcast.types';

/**
 * @class
 */
export class BroadcastAmqConnection {
  private connection: Amq.Connection;
  private connectionError: unknown;

  constructor(
    private address: string,
    private onChannelCreate: (channel: Amq.Channel) => Promise<void>,
    private connectionStateHandlers = new Map<ConnectionState, ConnectionStateHandler>(),
    private connectionErrorsCount = 0,
    private connectionState = ConnectionState.Offline,
    private maxConnectionErrors = 5
  ) {}

  /**
   * Reconnect to server
   *
   * This function is called when the connection is closed.
   *
   * @private
   * @async
   */
  private async handleConnectionClose(): Promise<void> {
    if (this.connectionState === ConnectionState.Closing) {
      this.connectionState = ConnectionState.Offline;
      log(`Connection closed`);

      if (this.connectionStateHandlers.has(ConnectionState.Offline)) {
        await this.connectionStateHandlers.get(ConnectionState.Offline)();
      }

      await this.reconnect();
    }
  }

  /**
   * Logs a connection error and tries to reconnect.
   * This function is called when there is a connection error.
   *
   * @private
   * @async
   * @param {Error} error
   */
  private handleConnectionError(error: Error): void {
    if (error.message !== 'Connection closing') {
      this.connectionErrorsCount++;
      log('Connection Error', { e: error });
    }
  }

  /**
   * Reconnect to server and reassign queue handlers.
   * This function is called when the connection is lost
   * due to an error or closure.
   *
   * After a failed connection attempt, the function calls
   * itself after a specified time.
   *
   * @private
   * @async
   */
  private async reconnect() {
    if (this.connectionState === ConnectionState.Offline) {
      log(`      >  Reconnectig`);
      try {
        await this.connect();
      } catch (error) {
        this.connectionState = ConnectionState.Offline;
        this.connectionErrorsCount++;
        const ms = Math.pow(this.connectionErrorsCount, 2) * 1000;
        await wait(ms);
        await this.reconnect();
      }
    }
  }

  /**
   * Connect to server
   *
   * @private
   * @async
   */
  public async connect(): Promise<Amq.Channel> {
    if (this.connectionState !== ConnectionState.Offline) {
      return;
    }
    this.connectionState = ConnectionState.Connecting;
    //
    this.connection = await Amq.connect(this.address);
    this.connection.on('error', (error: Error) => this.handleConnectionError(error));
    this.connection.on('close', () => this.handleConnectionClose());

    this.connectionState = ConnectionState.Online;

    log(`      >  Connected to AMQ ${this.address}`);

    const channel = await this.connection.createChannel();
    await this.onChannelCreate(channel);
  }

  /**
   * Close connection
   *
   * @param {unknown} reason
   */
  public async disconnect(reason?: unknown): Promise<void> {
    if (this.connectionState === ConnectionState.Online) {
      this.connectionState = ConnectionState.Closing;
      if (reason) {
        this.connectionError = reason;
      }
      await this.connection.close();

      log(`      >  Disconnected from AMQ ${this.address}`);
    }
  }

  /**
   *
   * @param {ConnectionState} state
   * @param {ConnectionStateHandler} handler
   */
  public addConnectionStateHandler(
    state: ConnectionState,
    handler: ConnectionStateHandler
  ): void {
    if (this.connectionStateHandlers.has(state)) {
      log(`Overwriting connection state: ${state} handler`);
    }
    this.connectionStateHandlers.set(state, handler);
  }

  /**
   *
   * @param {ConnectionState} state
   */
  public removeConnectionStateHandlers(state?: ConnectionState): void {
    if (state) {
      this.connectionStateHandlers.delete(state);
    } else {
      this.connectionStateHandlers.clear();
    }
  }

  public get isOnline(): boolean {
    return this.connectionState === ConnectionState.Online;
  }
}
