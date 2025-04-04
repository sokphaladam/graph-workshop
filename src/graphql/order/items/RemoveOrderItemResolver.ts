import { ContextType } from "src/ContextType";
import { CreateActivity } from "src/graphql/users/activity/ActivityResolver";
import { Formatter } from "src/lib/Formatter";
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
      .select("uuid", "status")
      .where({ id: order_item.order_id })
      .first();

    await CreateActivity(
      _,
      {
        data: {
          userId: ctx.auth.id,
          description: JSON.stringify(order_item),
          type: "REMOVE_ORDER_ITEM",
        },
      },
      ctx
    );

    if (status === "4") {
      await knex.table("order_items").where({ id: id }).update({ status: "4" });
      return true;
    }

    await knex.table("order_items").where({ id: id }).del();

    if (order) {
      if (order.status === "3") {
        await knex.table("orders").where({ id: order_item.order_id }).update({
          total_paid: 0,
          total: 0,
          customer_paid: 0,
          confirm_checkout_date: null,
          confirm_checkout_by: null,
          status: "1",
        });
      }

      GraphPubSub.publish(order.uuid, {
        orderSubscript: { status: "REMOVE" },
      });
      GraphPubSub.publish("ADMIN_CHANNEL", {
        orderSubscript: { status: "REMOVE", uuid: order.uuid },
      });
    } else {
      await knex.table("orders").where({ id: order_item.order_id }).update({
        total_paid: 0,
        confirm_checkout_date: null,
        confirm_checkout_by: null,
      });
    }
  }

  // sendNotification({}, "change status", ctx.auth);

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;
  const order_item = await knex.table("order_items").where({ id: id }).first();

  if (order_item) {
    const order = await knex
      .table("orders")
      .select("uuid")
      .where({ id: order_item.order_id })
      .first();
    await knex
      .table("order_items")
      .where("id", id)
      .increment("qty", 1)
      .update({
        updated_by: user ? user.id : null,
        updated_at: Formatter.getNowDateTime(),
      });
    await CreateActivity(
      _,
      {
        data: {
          userId: ctx.auth.id,
          description: `${JSON.stringify(order_item)} +1`,
          type: "PLUS_ORDER_ITEM",
        },
      },
      ctx
    );

    if (order) {
      if (order.status === "3") {
        await knex.table("orders").where({ id: order_item.order_id }).update({
          total_paid: 0,
          total: 0,
          customer_paid: 0,
          confirm_checkout_date: null,
          confirm_checkout_by: null,
        });
      }
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
  const user = ctx.auth;

  // sendNotification({}, `Change qty (-)`, ctx.auth);

  const order_item = await knex.table("order_items").where({ id: id }).first();

  if (order_item) {
    const order = await knex
      .table("orders")
      .select("uuid")
      .where({ id: order_item.order_id })
      .first();
    await knex
      .table("order_items")
      .where("id", id)
      .decrement("qty", 1)
      .update({
        updated_by: user ? user.id : null,
        updated_at: Formatter.getNowDateTime(),
      });
    await CreateActivity(
      _,
      {
        data: {
          userId: ctx.auth.id,
          description: `${JSON.stringify(order_item)} +1`,
          type: "SUB_ORDER_ITEM",
        },
      },
      ctx
    );
    if (order) {
      if (order.status === "3") {
        await knex.table("orders").where({ id: order_item.order_id }).update({
          total_paid: 0,
          total: 0,
          customer_paid: 0,
          confirm_checkout_date: null,
          confirm_checkout_by: null,
        });
      }
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
