import EventEmitter from "events";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { PubSub } from "graphql-subscriptions";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisEndpoint = process.env.REDIS;

abstract class IPubSub {
  abstract asyncIterator(
    channel: string
  ): AsyncIterator<unknown, unknown, undefined>;
  abstract publish(channel: string, data: unknown);
}

class RedisGraphPubSub implements IPubSub {
  protected redis: RedisPubSub;

  constructor(endpoint: string) {
    const options = {
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
      username: "default",
      password: "PIViYStQYFPiyFrK5WXLO4zEVYcOlgDJ",
    };

    this.redis = new RedisPubSub({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subscriber: new Redis(endpoint, options) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      publisher: new Redis(endpoint, options) as any,
    });
  }

  publish(channel, data) {
    this.redis.publish(channel, data);
  }

  asyncIterator(channel: string): AsyncIterator<unknown, unknown, undefined> {
    return this.redis.asyncIterator(channel);
  }
}

class InMemoryGraphPubSub implements IPubSub {
  protected pub: PubSub;

  constructor() {
    const biggerEventEmitter = new EventEmitter();
    biggerEventEmitter.setMaxListeners(Infinity);
    this.pub = new PubSub({ eventEmitter: biggerEventEmitter });
  }

  publish(channel, data) {
    this.pub.publish(channel, data);
  }

  asyncIterator(channel: string): AsyncIterator<unknown, unknown, undefined> {
    return this.pub.asyncIterator(channel);
  }
}

const GraphPubSub = redisEndpoint
  ? new RedisGraphPubSub(redisEndpoint)
  : new InMemoryGraphPubSub();
export default GraphPubSub;
