import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrder, StatusOrderItem } from "./OrderResolver";

interface Props {
  orderId: number;
  id: number;
  status: Graph.StatusOrder;
  itemStatus: Graph.StatusOrderItem;
}

export async function ChangeOrderStatusResolver(
  _,
  { data }: { data: Props },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  if (data.status) {
    await knex
      .table("orders")
      .where({ id: data.orderId })
      .update({ status: data.status });
  }

  if (data.id && data.itemStatus) {
    await knex
      .table("order_items")
      .where({ order_id: data.orderId, id: data.id })
      .update({ status: data.itemStatus });
  }

  return true;
}
