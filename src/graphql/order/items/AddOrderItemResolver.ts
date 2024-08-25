import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "../OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { table_orders } from "src/generated/tables";

export function sendNotification(
  order: table_orders,
  str: string,
  auth?: Graph.User
) {
  if (auth) {
    GraphPubSub.publish(order.uuid, {
      newOrderPending: str,
    });
    GraphPubSub.publish("ADMIN_CHANNEL", {
      newOrderPending: str,
    });
  } else {
    GraphPubSub.publish("ADMIN_CHANNEL", {
      newOrderPending: str,
    });
  }
}

export async function AddOrderItemResolver(
  _,
  { orderId, data }: { orderId: number; data: Graph.CartItemInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const auth = ctx.auth;

  const order: table_orders = await knex
    .table("orders")
    .where("id", orderId)
    .first();

  if (order) {
    const orderItem = await knex
      .table("order_items")
      .where({
        order_id: orderId,
        sku_id: data.skuId,
        product_id: data.productId,
      })
      .first();

    if (orderItem) {
      await knex
        .table("order_items")
        .where("id", orderItem.id)
        .update({
          qty: data.qty,
          discount: data.discount.toFixed(2),
          price: data.price.toFixed(2),
          addons: data.addons,
          remark: data.remark,
          status: StatusOrderItem.PENDING,
        });
      sendNotification(order, `Set: ${order.set} (Change)`, auth);
    } else {
      await knex.table("order_items").insert({
        order_id: orderId,
        sku_id: data.skuId,
        discount: data.discount.toFixed(2),
        price: data.price.toFixed(2),
        qty: data.qty,
        product_id: data.productId,
        addons: data.addons,
        remark: data.remark,
        status: StatusOrderItem.PENDING,
      });
      sendNotification(order, `Set: ${order.set} (New)`, auth);
    }
  }

  return true;
}
