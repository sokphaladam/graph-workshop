import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "../OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";

export async function RemoveOrderItemResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).update("status", status);

  GraphPubSub.publish("NEW_ORDER_PENDING", {
    newOrderPending: `Change Status`,
  });

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", 1);
  GraphPubSub.publish("NEW_ORDER_PENDING", {
    newOrderPending: `Change qty (+)`,
  });

  return true;
}

export async function DecreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", -1);
  GraphPubSub.publish("NEW_ORDER_PENDING", {
    newOrderPending: `Change qty (-)`,
  });

  return true;
}
