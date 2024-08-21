import { withFilter } from "graphql-subscriptions";
import { ContextType } from "src/ContextType";
import GraphPubSub from "src/lib/PubSub/PubSub";

export const NEW_ORDER_PENDING = "NEW_ORDER_PENDING";

export function NewOrderPending() {
  return GraphPubSub.asyncIterator("NEW_ORDER_PENDING");
}
