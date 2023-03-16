import { RedisSource } from './redis.source';

/**
 * @class
 */
export class CollectionRedisSource<StructType = unknown> {
  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(private readonly redisSource: RedisSource, private readonly name: string) {}

  public add(data: StructType) {
    this.redisSource.client.zAdd(this.name, { score: 1, value: '' });
  }

  public list(data: StructType) {
    this.redisSource.client.zAdd(this.name, { score: 1, value: '' });
  }
}
