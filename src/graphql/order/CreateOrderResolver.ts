import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_order_items, table_orders } from "src/generated/tables";
import { prefix } from "src/lib/prefix";

function getTotal(price, discount, qty) {
  const discount_price = (price * discount) / 100;
  const total = (price - discount_price) * qty;
  return total;
}

export async function CreateOrderResolver(
  _,
  { data }: { data: Graph.OrderInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input_order: table_orders = {
    customer_number: data.name,
    address: data.address,
    order: data.carts.length,
    set: data.set,
    status: "PENDING",
    total: data.carts
      .reduce((a, b) => (a = a + getTotal(b.price, b.discount, b.qty)), 0)
      .toFixed(2),
    total_paid: "0",
    uuid:
      prefix(data.name.split(" ").map((x) => x.charAt(0).toUpperCase())) +
      new Date().getTime(),
  };

  const create = await knex.transaction((tx) => {
    return tx
      .table("orders")
      .insert(input_order)
      .then((res) => {
        return tx.table("order_items").insert(
          data.carts.map((x) => {
            return {
              order_id: res[0],
              discount: x.discount.toFixed(2),
              price: x.price.toFixed(2),
              qty: x.qty,
              sku_id: x.skuId,
              product_id: x.productId,
            };
          })
        );
      });
  });

  return create[0] > 0;
}
