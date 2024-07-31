import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_item_stock } from "src/generated/tables";

export async function UpdateStockResolver(
  _,
  { data, id }: { id: number; data: Graph.ProductStockInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table<table_item_stock>("item_stock").where("id", id).update({
    product_id: data.productId,
    location: data.location,
    qty: data.qty,
  });

  return true;
}
