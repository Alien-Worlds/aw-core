/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { Block } from '../entities/block';

export type BlockReaderOptions = {
  shouldFetchDeltas?: boolean;
  shouldFetchTraces?: boolean;
  shouldFetchBlock?: boolean;
  [key: string]: unknown;
};

/**
 * A callback that is used for async operations.
 *
 * @callback AsyncCallback
 * @returns {Promise<void>}
 */
export type AsyncCallback = (...args: unknown[]) => Promise<void>;

/**
 * Configuration options for the Block Reader.
 * @typedef {Object} BlockReaderConfig
 * @property {string[]} endpoints - An array of endpoint URLs to connect to.
 * @property {number} [reconnectInterval] - The interval (in milliseconds) to attempt reconnection to the endpoints.
 * @property {boolean} [shouldFetchDeltas] - Specifies whether to fetch deltas.
 * @property {boolean} [shouldFetchTraces] - Specifies whether to fetch traces.
 * @property {boolean} [shouldFetchBlock] - Specifies whether to fetch blocks.
 */
export type BlockReaderConfig = BlockReaderOptions & {
  endpoints: string[];
  reconnectInterval?: number;
  [key: string]: unknown;
};

/**
 * BlockReader is responsible for managing the connection to a block reader service and handling block retrieval.
 */
export abstract class BlockReader {
  protected errorHandler: (error: Error) => void;
  protected warningHandler: (...args: unknown[]) => void;
  protected receivedBlockHandler: (content: Block) => Promise<void> | void;
  protected blockRangeCompleteHandler: (
    startBlock: bigint,
    endBlock: bigint
  ) => Promise<void>;
  protected connectedCallback: AsyncCallback;
  protected disconnectedCallback: AsyncCallback;

  /**
   * Establishes a connection to the block reader service.
   *
   * @abstract
   * @returns {Promise<void>} A promise that resolves once the connection is established.
   */
  public abstract connect(): Promise<void>;

  /**
   * Closes the connection to the block reader service.
   *
   * @abstract
   * @returns {Promise<void>} A promise that resolves once the connection is closed.
   */
  public abstract disconnect(): Promise<void>;

  /**
   * Pauses block retrieval. The BlockReader will stop sending requests for blocks.
   *
   * @abstract
   */
  public abstract pause(): void;

  /**
   * Resumes block retrieval. The BlockReader will continue sending requests for blocks.
   *
   * @abstract
   */
  public abstract resume(): void;

  /**
   * Reads a range of blocks from the block reader service.
   *
   * @abstract
   * @param {bigint} startBlock - The starting block number.
   * @param {bigint} endBlock - The ending block number (exclusive).
   * @param {BlockReaderOptions} [options] - Additional options for block retrieval.
   */
  public abstract readBlocks(
    startBlock: bigint,
    endBlock: bigint,
    options?: BlockReaderOptions
  ): void;

  /**
   * Reads a single block from the block reader service.
   *
   * @abstract
   * @param {bigint} block - The block number to retrieve.
   * @param {BlockReaderOptions} [options] - Additional options for block retrieval.
   */
  public abstract readOneBlock(block: bigint, options?: BlockReaderOptions): void;

  /**
   * Sets a callback function to handle received blocks.
   * @param {(content: Block) => Promise<void> | void} handler - The callback function for handling received blocks.
   */
  public onReceivedBlock(handler: (content: Block) => Promise<void> | void) {
    this.receivedBlockHandler = handler;
  }

  /**
   * Sets a callback function to handle completion of a block range retrieval.
   * @param {(startBlock: bigint, endBlock: bigint) => Promise<void>} handler - The callback function for handling completion of block range retrieval.
   */
  public onComplete(handler: (startBlock: bigint, endBlock: bigint) => Promise<void>) {
    this.blockRangeCompleteHandler = handler;
  }

  /**
   * Sets an error handler function to handle errors.
   * @param {(error: Error) => void} handler - The error handler function.
   */
  public onError(handler: (error: Error) => void) {
    this.errorHandler = handler;
  }

  /**
   * Sets a warning handler function to handle warnings.
   * @param {(...args: unknown[]) => void} handler - The warning handler function.
   */
  public onWarning(handler: (...args: unknown[]) => void) {
    this.warningHandler = handler;
  }

  /**
   * Registers a callback to be invoked when a connection is established.
   *
   * @param {AsyncCallback} callback - The callback to be invoked on connection.
   * @returns {void}
   */
  public onConnected(callback: AsyncCallback): void {
    this.connectedCallback = callback;
  }

  /**
   * Registers a callback to be invoked when a connection is terminated.
   *
   * @param {AsyncCallback} callback - The callback to be invoked on disconnection.
   * @returns {void}
   */
  public onDisconnected(callback: AsyncCallback): void {
    this.disconnectedCallback = callback;
  }
}
