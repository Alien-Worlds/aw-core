import { RedisSource } from './redis.source';
import { RedisHashDocument } from './redis.types';

const toString = (value: string | object | number | Buffer) =>
  value instanceof Buffer
    ? value.toString()
    : typeof value === 'object'
    ? JSON.stringify(value)
    : String(value);

/**
 * @class
 */
export class HashCollectionRedisSource {
  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(private readonly redisSource: RedisSource, private readonly name: string) {}

  public add(key: string, value: string | object | number | Buffer) {
    const { name } = this;
    return this.redisSource.client.sendCommand(['HSET', name, key, toString(value)]);
  }

  public addMany(items: { key: string; value: string | object | number | Buffer }[]) {
    const { name } = this;
    const args = [];

    items.forEach(item => {
      args.push(item.key, toString(item.value));
    });

    return this.redisSource.client.sendCommand(['HSET', name, ...args]);
  }

  public async list(keys?: string[]): Promise<RedisHashDocument> {
    const { name } = this;
    const document: RedisHashDocument = {};

    if (keys) {
      for (const key of keys) {
        const value: string = await this.redisSource.client.sendCommand([
          'HGET',
          name,
          key,
        ]);
        document[key] = value;
      }
    } else {
      const list = (await this.redisSource.client.sendCommand([
        'HGETALL',
        name,
      ])) as string[];
      for (let i = 0; i < list.length; i += 2) {
        const key = list[i];
        const value = list[i + 1];
        document[key] = value;
      }
    }

    return document;
  }

  public async remove(keys: string[]): Promise<boolean> {
    const { name } = this;
    let count = 0;
    for (const key of keys) {
      const result: number = await this.redisSource.client.sendCommand([
        'HDEL',
        name,
        key,
      ]);

      count += result;
    }

    return count > 0;
  }

  public async clear(): Promise<boolean> {
    const { name } = this;
    const keys: string[] = await this.redisSource.client.sendCommand(['HKEYS', name]);

    if (Array.isArray(keys)) {
      await this.remove(keys);
    }

    return true;
  }
}
