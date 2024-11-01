import DataLoader from "dataloader";
import { Knex } from "knex";
import { table_order_schedule_detail } from "src/generated/tables";
import { createSkuByIDLoader } from "./SkuLoader";

export function createOrderScheduleItemLoader(knex: Knex) {
  const loaderSku = createSkuByIDLoader(knex);
  return new DataLoader(async (keys: number[]) => {
    const items: table_order_schedule_detail[] = await knex
      .table("order_schedule_detail")
      .whereIn("order_schedule_id", keys);

    return keys.map((row) => {
      const item = items.filter((f) => f.order_schedule_id === row);
      return item.map((x) => {
        return {
          sku: () => loaderSku.load(x.sku_id),
        };
      });
    });
  });
}
