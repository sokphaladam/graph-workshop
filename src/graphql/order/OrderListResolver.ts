import { ContextType } from "src/ContextType";
import { createOrderItemLoader } from "src/dataloader/OrderItemLoader";
import { Graph } from "src/generated/graph";
import { table_orders } from "src/generated/tables";
import { OrderViewBy, StatusOrder, StatusOrderItem } from "./OrderResolver";

export async function OrderListResolver(
  _,
  { offset, limit, viewBy },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const loader = createOrderItemLoader(knex, viewBy === OrderViewBy.KITCHEN);

  const query = knex
    .table("orders")
    .orderBy([
      { column: "id", order: "asc" },
      { column: "status", order: "asc" },
    ])
    .offset(offset)
    .limit(limit);

  if (viewBy === OrderViewBy.KITCHEN) {
    query.whereIn("status", [
      StatusOrder.PENDING,
      StatusOrder.VERIFY,
      StatusOrder.DELIVERY,
    ]);
  }

  const items: table_orders[] = await query;

  return items.map((x) => {
    return {
      id: x.id,
      name: x.customer_number,
      address: x.address,
      set: x.set,
      status: isNaN(Number(x.status)) ? StatusOrder[x.status] : x.status,
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
