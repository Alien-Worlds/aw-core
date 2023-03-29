import { RedisSource } from './redis.source';
import { RedisSortedDocument } from './redis.types';

/**
 * @class
 */
export class SortedCollectionRedisSource {
  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(private readonly redisSource: RedisSource, private readonly name: string) {}

  public async add(score: number, value: string) {
    const { name } = this;
    return this.redisSource.client.zAdd(name, { score, value });
  }

  public async addMany(items: RedisSortedDocument[]) {
    const { name } = this;
    if (Array.isArray(items) && items.length > 0) {
      await this.redisSource.client.zAdd(name, items);
      return true;
    }

    return false;
  }

  public async list(
    offset: number,
    limit: number,
    order = 1
  ): Promise<RedisSortedDocument[]> {
    const { name } = this;
    const list: RedisSortedDocument[] = [];
    let items = [];
    let r = 0;

    items = await this.redisSource.client.sendCommand([
      order === -1 ? 'ZREVRANGE' : 'ZRANGE',
      name,
      String(offset),
      String(offset + limit),
      'WITHSCORES',
    ]);

    for (let i = 0; i < items.length; i += 2) {
      const value = items[i];
      const score = items[i + 1];
      list.push({ value, score, rank: offset + r });
      r++;
    }

    if (order === -1 && list[0]) {
      const rank = await this.redisSource.client.zRank(name, list[0].value);

      list.forEach((item, i) => {
        item.rank = rank - i;
      });
    }

    return list;
  }

  public getScore(value: string) {
    const { name } = this;
    return this.redisSource.client.zScore(name, value);
  }

  public getRank(value: string, order = 1) {
    const { name } = this;

    if (order === 1) {
      return this.redisSource.client.zRank(name, value);
    }

    return this.redisSource.client.zRevRank(name, value);
  }

  public async clear(): Promise<boolean> {
    const { name } = this;
    const result = await this.redisSource.client.sendCommand([
      'ZREMRANGEBYRANK',
      name,
      '0',
      '-1',
    ]);

    return result > 0;
  }
}
