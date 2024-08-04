import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_order_items } from "src/generated/tables";
import { createSkuByIDLoader } from "./SkuLoader";
import { StatusOrderItem } from "src/graphql/order/OrderResolver";

export function createOrderItemLoader(knex: Knex) {
  const loader = createSkuByIDLoader(knex);
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
            status: isNaN(Number(x.status))
              ? StatusOrderItem[x.status]
              : x.status,
            sku: () => loader.load(x.sku_id),
          };
        });
    });
  });
}
