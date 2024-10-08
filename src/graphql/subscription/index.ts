import { ContextType } from "src/ContextType";
import GraphPubSub from "src/lib/PubSub/PubSub";

export const SubscriptionResolvers = {
  newOrderPending: {
    subscribe: (_, { channel }) => {
      if (channel) {
        return GraphPubSub.asyncIterator(channel);
      }
      return false;
    },
  },
  orderSubscript: {
    subscribe: (_, { channel }) => {
      if (channel) {
        return GraphPubSub.asyncIterator(channel);
      }
      return false;
    },
  },
};
