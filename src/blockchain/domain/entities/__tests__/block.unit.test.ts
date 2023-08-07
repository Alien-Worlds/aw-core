import { BlockNumberWithId, Block } from '../block';

describe('BlockNumberWithId', () => {
  describe('create', () => {
    it('should create a BlockNumberWithId instance from a JSON object', () => {
      const dto = {
        block_num: '12345',
        block_id: 'abcdef123456',
      };

      const result = BlockNumberWithId.create(dto);

      expect(result).toBeInstanceOf(BlockNumberWithId);
      expect(result.blockNumber).toBe(BigInt(12345));
      expect(result.blockId).toBe('abcdef123456');
    });
  });

  describe('toJson', () => {
    it('should convert the BlockNumberWithId instance to a JSON object', () => {
      const instance = new BlockNumberWithId(BigInt(12345), 'abcdef123456');

      const result = instance.toJson();

      expect(result).toEqual({
        block_num: '12345',
        block_id: 'abcdef123456',
      });
    });
  });
});

describe('Block', () => {
  describe('create', () => {
    it('should create a Block instance from a JSON object', () => {
      const json = {
        head: {
          block_num: '12345',
          block_id: 'abcdef123456',
        },
        last_irreversible: {
          block_num: '54321',
          block_id: '654321fedcba',
        },
        prev_block: {
          block_num: '11111',
          block_id: '111111111111',
        },
        this_block: {
          block_num: '22222',
          block_id: '222222222222',
        },
        block: new Uint8Array([1, 2, 3]),
        traces: new Uint8Array([4, 5, 6]),
        deltas: new Uint8Array([7, 8, 9]),
        abi_version: '1.0',
      };

      const result = Block.create(json);

      expect(result).toBeInstanceOf(Block);
      expect(result.head).toBeInstanceOf(BlockNumberWithId);
      expect(result.head.blockNumber).toBe(BigInt(12345));
      expect(result.head.blockId).toBe('abcdef123456');
      expect(result.lastIrreversible).toBeInstanceOf(BlockNumberWithId);
      expect(result.lastIrreversible.blockNumber).toBe(BigInt(54321));
      expect(result.lastIrreversible.blockId).toBe('654321fedcba');
      expect(result.prevBlock).toBeInstanceOf(BlockNumberWithId);
      expect(result.prevBlock.blockNumber).toBe(BigInt(11111));
      expect(result.prevBlock.blockId).toBe('111111111111');
      expect(result.thisBlock).toBeInstanceOf(BlockNumberWithId);
      expect(result.thisBlock.blockNumber).toBe(BigInt(22222));
      expect(result.thisBlock.blockId).toBe('222222222222');
      expect(result.block).toEqual(new Uint8Array([1, 2, 3]));
      expect(result.traces).toEqual(new Uint8Array([4, 5, 6]));
      expect(result.deltas).toEqual(new Uint8Array([7, 8, 9]));
      expect(result.abiVersion).toBe('1.0');
    });
  });

  describe('toJson', () => {
    it('should convert the Block instance to a JSON object', () => {
      const head = new BlockNumberWithId(BigInt(12345), 'abcdef123456');
      const lastIrreversible = new BlockNumberWithId(BigInt(54321), '654321fedcba');
      const prevBlock = new BlockNumberWithId(BigInt(11111), '111111111111');
      const thisBlock = new BlockNumberWithId(BigInt(22222), '222222222222');
      const block = new Uint8Array([1, 2, 3]);
      const traces = new Uint8Array([4, 5, 6]);
      const deltas = new Uint8Array([7, 8, 9]);
      const abiVersion = '1.0';

      const instance = new Block(
        head,
        lastIrreversible,
        prevBlock,
        thisBlock,
        block,
        traces,
        deltas,
        abiVersion
      );

      const result = instance.toJson();

      expect(result).toEqual({
        head: {
          block_num: '12345',
          block_id: 'abcdef123456',
        },
        last_irreversible: {
          block_num: '54321',
          block_id: '654321fedcba',
        },
        prev_block: {
          block_num: '11111',
          block_id: '111111111111',
        },
        this_block: {
          block_num: '22222',
          block_id: '222222222222',
        },
        block: block,
        traces: traces,
        deltas: deltas,
        abi_version: abiVersion,
      });
    });
  });
});
