import { ContextType } from "src/ContextType";

export async function OrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const items = await knex.table("order_items").where({ id }).first();

  const order = await knex
    .table("orders")
    .where({ id: items.order_id })
    .first();

  const product = await knex
    .table("products")
    .where({ id: items.product_id })
    .first();

  const sku = await knex
    .table("product_sku")
    .where({ id: items.sku_id })
    .first();

  const delivery = await knex
    .table("delivery")
    .where({
      id: order.deliver_id || 0,
    })
    .first();

  return {
    item: items,
    product: product,
    sku: sku,
    order: order,
    delivery: delivery,
  };
}
