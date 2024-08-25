import { ContextType } from "src/ContextType";
import GraphPubSub from "src/lib/PubSub/PubSub";

export const SubscriptionResolvers = {
  newOrderPending: {
    subscribe: (_, { channel }, ctx: ContextType) => {
      if (channel) {
        return GraphPubSub.asyncIterator(channel);
      }
      return false;
    },
  },
};
