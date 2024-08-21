import { PubSub } from "graphql-subscriptions";

abstract class IPubSub {
  abstract asyncIterator(
    channel: string
  ): AsyncIterator<unknown, unknown, undefined>;
  abstract publish(channel: string, data: unknown);
}

class InMemoryGraphPubSub implements IPubSub {
  protected pub: PubSub;

  constructor() {
    this.pub = new PubSub();
  }

  publish(channel, data) {
    this.pub.publish(channel, data);
  }

  asyncIterator(channel: string): AsyncIterator<unknown, unknown, undefined> {
    return this.pub.asyncIterator(channel);
  }
}

const GraphPubSub = new InMemoryGraphPubSub();
export default GraphPubSub;
