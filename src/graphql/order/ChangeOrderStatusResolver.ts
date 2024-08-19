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
    if (Number(data.status) === 3) {
      const items = await knex
        .table("order_items")
        .where({ order_id: data.orderId })
        .whereIn("status", [StatusOrderItem.COMPLETED]);

      const total = items.reduce((a, b) => {
        const dis_price = Number(b.price) * (Number(b.discount) / 100);
        const amount = Number(b.qty) * (Number(b.price) - dis_price);
        return (a = a + amount);
      }, 0);

      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({ status: data.status, total, order: items.length });
    } else {
      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({ status: data.status });
    }
  }

  if (data.id && data.itemStatus) {
    await knex
      .table("order_items")
      .where({ order_id: data.orderId, id: data.id })
      .update({ status: data.itemStatus });
  }

  return true;
}
