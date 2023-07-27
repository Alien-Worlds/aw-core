import { parseToBigInt } from '../../../utils';
import { BlockJsonModel, BlockNumberWithIdJsonModel } from '../../data/dtos/block.dto';

/**
 * Represents a block number with its corresponding block ID.
 * @class
 */
export class BlockNumberWithId {
  /**
   * Creates a BlockNumberWithId instance from a JSON object.
   *
   * @param {BlockNumberWithIdJsonModel} json - The JSON object containing the block number and ID.
   * @returns {BlockNumberWithId} The created BlockNumberWithId instance.
   */
  public static create(json: BlockNumberWithIdJsonModel) {
    const { block_id, block_num } = json;
    return new BlockNumberWithId(parseToBigInt(block_num), block_id);
  }

  /**
   * Creates an instance of BlockNumberWithId.
   *
   * @param {bigint} blockNumber - The block number.
   * @param {string} blockId - The block ID.
   */
  constructor(public readonly blockNumber: bigint, public readonly blockId: string) {}

  /**
   * Converts the BlockNumberWithId instance to a JSON object.
   *
   * @returns {BlockNumberWithIdJsonModel} The JSON representation of the BlockNumberWithId instance.
   */
  public toJson() {
    return {
      block_num: this.blockNumber.toString(),
      block_id: this.blockId,
    };
  }
}

/**
 * Represents a block in the blockchain.
 * @class
 */
export class Block {
  /**
   * Creates a Block instance from a JSON object.
   *
   * @param {BlockJsonModel} json - The JSON object containing the block information.
   * @returns {Block} The created Block instance.
   */
  public static create(json: BlockJsonModel): Block {
    const { block, traces, deltas, abi_version } = json;
    const head = BlockNumberWithId.create(json.head);
    const lastIrreversible = BlockNumberWithId.create(json.last_irreversible);
    const prevBlock = BlockNumberWithId.create(json.prev_block);
    const thisBlock = BlockNumberWithId.create(json.this_block);

    return new Block(
      head,
      lastIrreversible,
      prevBlock,
      thisBlock,
      block,
      traces,
      deltas,
      abi_version
    );
  }

  /**
   * Creates an instance of Block.
   *
   * @param {BlockNumberWithId} head - The head block number with its corresponding block ID.
   * @param {BlockNumberWithId} lastIrreversible - The last irreversible block number with its corresponding block ID.
   * @param {BlockNumberWithId} prevBlock - The previous block number with its corresponding block ID.
   * @param {BlockNumberWithId} thisBlock - The current block number with its corresponding block ID.
   * @param {Uint8Array} block - The block data.
   * @param {Uint8Array} traces - The trace data.
   * @param {Uint8Array} deltas - The delta data.
   * @param {string} [abiVersion] - The ABI version.
   * @param {string} [id] - The ID.
   */
  constructor(
    public readonly head: BlockNumberWithId,
    public readonly lastIrreversible: BlockNumberWithId,
    public readonly prevBlock: BlockNumberWithId,
    public readonly thisBlock: BlockNumberWithId,
    public readonly block: Uint8Array,
    public readonly traces: Uint8Array,
    public readonly deltas: Uint8Array,
    public readonly abiVersion?: string,
    public readonly id?: string
  ) {}

  /**
   * Converts the Block instance to a JSON object.
   *
   * @returns {BlockJsonModel} The JSON representation of the Block instance.
   */
  public toJson(): BlockJsonModel {
    const {
      head,
      thisBlock,
      prevBlock,
      lastIrreversible,
      block,
      traces,
      deltas,
      abiVersion,
    } = this;

    const json: BlockJsonModel = {
      head: head.toJson(),
      this_block: thisBlock.toJson(),
      prev_block: prevBlock.toJson(),
      last_irreversible: lastIrreversible.toJson(),
      block,
      traces,
      deltas,
    };

    if (abiVersion) {
      json.abi_version = abiVersion;
    }

    return json;
  }
}
