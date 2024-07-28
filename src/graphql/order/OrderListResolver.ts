import { ContextType } from "src/ContextType";
import { createOrderItemLoader } from "src/dataloader/OrderItemLoader";
import { table_orders } from "src/generated/tables";

export async function OrderListResolver(
  _,
  { offset, limit },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const loader = createOrderItemLoader(knex);

  const items: table_orders[] = await knex
    .table("orders")
    .offset(offset)
    .limit(limit);

  return items.map((x) => {
    return {
      id: x.id,
      name: x.customer_number,
      address: x.address,
      set: x.set,
      status: x.status,
      uuid: x.uuid,
      items: () => loader.load(x.id),
      total: x.total,
      paid: x.total_paid,
    };
  });
}
