import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_order_items } from "src/generated/tables";
import { createSkuByProductIDLoader } from "./SkuLoader";

export function createOrderItemLoader(knex: Knex) {
  const loader = createSkuByProductIDLoader(knex);
  return new Dataloader(async (keys: number[]) => {
    const items: table_order_items[] = await knex
      .table<table_order_items>("order_items")
      .whereIn("order_id", keys);

    return keys.map((row) => {
      return items
        .filter((x) => x.order_id === row)
        .map((x) => {
          return {
            id: x.id,
            price: x.price,
            qty: x.qty,
            discount: x.discount,
            sku: () => loader.load(x.sku_id),
          };
        });
    });
  });
}
