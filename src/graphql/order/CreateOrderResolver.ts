import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_order_items, table_orders } from "src/generated/tables";
import { prefix } from "src/lib/prefix";
import { StatusOrder, StatusOrderItem } from "./OrderResolver";
import { Formatter } from "src/lib/Formatter";

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
  const auth = ctx.auth;

  if (!auth) {
    return 0;
  }

  const total = data.carts.reduce((a, b) => {
    const dis_price = Number(b.price) * (Number(b.discount) / 100);
    const amount = Number(b.qty) * (Number(b.price) - dis_price);
    return (a = a + amount);
  }, 0);
  const qty = data.carts.reduce((a, b) => (a = a + b.qty), 0);

  const input_order: table_orders = {
    customer_number: data.name,
    address: data.address,
    order: qty,
    set: data.set,
    status: StatusOrder.CHECKOUT,
    confirm_checkout_date: Formatter.getNowDateTime() as any,
    confirm_checkout_by: auth ? auth.id : null,
    total: String(total),
    total_paid: String(total),
    uuid: data.uuid
      ? data.uuid
      : prefix(data.name.split(" ").map((x) => x.charAt(0).toUpperCase())) +
        new Date().getTime(),
    invoice: data.invoice,
    bank_type: data.bankType,
    currency: data.currency,
    bank: data.bankId,
    discount: String(data.discount),
    customer_paid: data.customerPaid,
    verify_date: Formatter.getNowDateTime() as any,
    verify_by: auth ? auth.id : null,
    note: data.note,
  };

  let order_id = 0;

  const create = await knex.transaction((tx) => {
    return tx
      .table("orders")
      .insert(input_order)
      .then((res) => {
        return tx.table("order_items").insert(
          data.carts.map((x) => {
            order_id = res[0];
            return {
              order_id: res[0],
              discount: x.discount.toFixed(2),
              price: x.price.toFixed(2),
              qty: x.qty,
              sku_id: x.skuId,
              product_id: x.productId,
              addons: x.addons,
              remark: x.remark,
              status: StatusOrderItem.MAKING,
              is_print: true,
              created_by: auth ? auth.id : null,
              updated_by: auth ? auth.id : null,
            };
          })
        );
      });
  });

  return create[0] > 0 ? order_id : 0;
}
