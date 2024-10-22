import { ContextType } from "src/ContextType";

export async function OrderBalanceSummaryResolver(
  _,
  { from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const order = await knex
    .table("orders")
    .whereIn("status", ["3"])
    .whereRaw("DATE(confirm_checkout_date) BETWEEN :from AND :to", {
      from: from,
      to: to,
    })
    .select(["total_paid", "discount", "signature_date", "status", "id"]);

  const order_items = await knex
    .table("order_items")
    .innerJoin("orders", "orders.id", "order_items.order_id")
    .whereRaw("DATE(order_items.created_at) BETWEEN :from AND :to", {
      from: from,
      to: to,
    })
    .whereIn("orders.status", ["1", "2", "3"])
    .select([
      "order_items.id",
      "order_items.price",
      "order_items.qty",
      "order_items.discount",
      "orders.total_paid",
      "orders.discount as odis",
    ]);

  const products = await knex
    .table("products")
    .where({ is_active: true })
    .count("* as count")
    .first();

  const staff = await knex
    .table("users")
    .where({ active: true, type: "STAFF" })
    .count("* as count")
    .first();

  return {
    order:
      order
        .filter((f) => f.status === "3")
        .reduce((a, b) => {
          const dis = (Number(b.total_paid) * Number(b.discount)) / 100;
          const am = Number(b.total_paid) - dis;
          return (a = Number(a) + am);
        }, 0) || 0,
    discount: order.filter((f) => f.discount > 0).length,
    signature: order.filter((f) => f.signature_date).length,
    product: products.count || 0,
    staff: staff.count || 0,
    expct_order:
      order_items.reduce((a, b) => {
        const dis = (Number(b.price) * Number(b.discount)) / 100;
        const am = Number(b.price) - dis;
        return (a = Number(a) + Number(b.qty) * am);
      }, 0) || 0,
  };
}
