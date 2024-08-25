import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "../OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { sendNotification } from "./AddOrderItemResolver";

export async function RemoveOrderItemResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("order_items")
    .innerJoin("orders", "orders.id", "order_items.order_id")
    .where("id", id)
    .select("uuid")
    .first();

  await knex.table("order_items").where("id", id).update("status", status);

  sendNotification(item, "change status", ctx.auth);

  // GraphPubSub.publish("NEW_ORDER_PENDING", {
  //   newOrderPending: `Change Status`,
  // });

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("order_items")
    .innerJoin("orders", "orders.id", "order_items.order_id")
    .where("id", id)
    .select("uuid")
    .first();

  await knex.table("order_items").where("id", id).increment("qty", 1);
  // GraphPubSub.publish("NEW_ORDER_PENDING", {
  //   newOrderPending: `Change qty (+)`,
  // });
  sendNotification(item, `Change qty (+)`, ctx.auth);

  return true;
}

export async function DecreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("order_items")
    .innerJoin("orders", "orders.id", "order_items.order_id")
    .where("id", id)
    .select("uuid")
    .first();

  await knex.table("order_items").where("id", id).increment("qty", -1);
  // GraphPubSub.publish("NEW_ORDER_PENDING", {
  //   newOrderPending: `Change qty (-)`,
  // });
  sendNotification(item, `Change qty (-)`, ctx.auth);

  return true;
}
