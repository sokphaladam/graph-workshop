import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "../OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { table_orders } from "src/generated/tables";

export async function AddOrderItemResolver(
  _,
  { orderId, data }: { orderId: number; data: Graph.CartItemInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

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
        addons: data.addons,
        remark: data.remark,
        is_print: false,
      })
      .first();

    // return true;

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
      // sendNotification(order, `Set: ${order.set} (Change)`, auth);
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

      GraphPubSub.publish(order.uuid, {
        orderSubscript: { status: "ADD_ITEM" },
      });

      GraphPubSub.publish("ADMIN_CHANNEL", {
        orderSubscript: { status: "ADD_ITEM", uuid: order.uuid },
      });
    }
  }

  return true;
}
