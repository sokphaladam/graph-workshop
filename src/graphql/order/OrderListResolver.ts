import { ContextType } from "src/ContextType";
import { createOrderItemLoader } from "src/dataloader/OrderItemLoader";
import { Graph } from "src/generated/graph";
import { table_orders } from "src/generated/tables";
import { StatusOrder, StatusOrderItem } from "./OrderResolver";

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
      status: StatusOrder[x.status],
      uuid: x.uuid,
      items: () => loader.load(x.id),
      total: x.total,
      paid: x.total_paid,
    };
  });
}

export async function OrderKeyResolver(_, { id, token }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loader = createOrderItemLoader(knex);

  if (!token && !id) {
    return null;
  }

  const query = knex.table("orders").first();

  if (id) {
    query.where({ id });
  }

  if (token) {
    query.where({ uuid: token });
  }

  const item: table_orders = await query.clone();

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.customer_number,
    address: item.address,
    set: item.set,
    status: isNaN(Number(item.status)) ? StatusOrder[item.status] : item.status,
    uuid: item.uuid,
    items: () => loader.load(item.id),
    total: item.total,
    paid: item.total_paid,
  };
}
