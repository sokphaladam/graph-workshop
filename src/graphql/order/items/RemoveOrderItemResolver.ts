import { ContextType } from "src/ContextType";
import GraphPubSub from "src/lib/PubSub/PubSub";

export async function RemoveOrderItemResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const order_item = await knex.table("order_items").where("id", id).first();

  if (order_item) {
    const order = await knex
      .table("orders")
      .select("uuid")
      .where({ id: order_item.order_id })
      .first();

    await knex.table("order_items").where({ id: id }).del();

    await knex.table("orders").where({ id: order_item.order_id }).update({
      total_paid: 0,
      confirm_checkout_date: null,
      confirm_checkout_by: null,
    });

    if (order) {
      GraphPubSub.publish(order.uuid, {
        orderSubscript: { status: "REMOVE" },
      });
      GraphPubSub.publish("ADMIN_CHANNEL", {
        orderSubscript: { status: "REMOVE", uuid: order.uuid },
      });
    }
  }

  // sendNotification({}, "change status", ctx.auth);

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const order_item = await knex.table("order_items").where({ id: id }).first();

  if (order_item) {
    const order = await knex
      .table("orders")
      .select("uuid")
      .where({ id: order_item.order_id })
      .first();
    await knex.table("order_items").where("id", id).increment("qty", 1);
    if (order) {
      GraphPubSub.publish(order.uuid, {
        orderSubscript: { status: "ADD_QTY" },
      });
      GraphPubSub.publish("ADMIN_CHANNEL", {
        orderSubscript: { status: "ADD_QTY", uuid: order.uuid },
      });
    }
  }

  // sendNotification({}, `Change qty (+)`, ctx.auth);

  return true;
}

export async function DecreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  // sendNotification({}, `Change qty (-)`, ctx.auth);

  const order_item = await knex.table("order_items").where({ id: id }).first();

  if (order_item) {
    const order = await knex
      .table("orders")
      .select("uuid")
      .where({ id: order_item.order_id })
      .first();
    await knex.table("order_items").where("id", id).decrement("qty", 1);
    if (order) {
      GraphPubSub.publish(order.uuid, {
        orderSubscript: { status: "REMOVE_QTY" },
      });
      GraphPubSub.publish("ADMIN_CHANNEL", {
        orderSubscript: { status: "REMOVE_QTY", uuid: order.uuid },
      });
    }
  }

  return true;
}
