import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_product_sku } from "src/generated/tables";
import { createProductByIDLoader } from "./ProductLoader";
import { isTimeInRange } from "src/lib/isTimeInRange";
import { Formatter } from "src/lib/Formatter";
import moment from "moment";

export function createSkuByProductIDLoader(
  knex: Knex,
  useSchedule?: boolean,
  enabledOn?: string[]
) {
  return new Dataloader(async (keys: number[]) => {
    const query = knex
      .table<table_product_sku>("product_sku")
      .whereIn("product_id", keys)
      .where("is_active", "=", true);

    if (enabledOn && enabledOn.length > 0) {
      query.whereIn("enabled_on", enabledOn);
    }

    const items: table_product_sku[] = await query.clone().select();

    if (!!useSchedule) {
      const schedule = await knex
        .table("order_schedule")
        .innerJoin(
          "order_schedule_detail",
          "order_schedule.id",
          "order_schedule_detail.order_schedule_id"
        )
        .whereIn(
          "sku_id",
          items.map((x) => x.id)
        );

      const data = [];
      for (const x of items) {
        const find = schedule.find((f) => f.sku_id === x.id);
        if (!find) {
          data.push(x);
        } else {
          if (
            !!isTimeInRange(
              find.start_at,
              find.end_at,
              moment(Formatter.getNowDateTime()).format("HH:mm:ss")
            )
          ) {
            data.push(x);
          } else {
            data.push({
              ...x,
              status: "TIME_OUT",
            });
          }
        }
      }
      return keys.map((row) => {
        return data
          .filter((x) => x.product_id === row)
          .map((x) => {
            return {
              id: x.id,
              unit: x.unit,
              price: x.price,
              discount: x.discount,
              name: x.name,
              image: x.image,
              status: x.status,
              enabledOn: x.enabled_on,
            };
          });
      });
    }

    return keys.map((row) => {
      return items
        .filter((x) => x.product_id === row)
        .map((x) => {
          return {
            id: x.id,
            unit: x.unit,
            price: x.price,
            discount: x.discount,
            name: x.name,
            image: x.image,
            status: x.status,
            enabledOn: x.enabled_on,
          };
        });
    });
  });
}

export function createSkuByIDLoader(knex: Knex) {
  const loaderProduct = createProductByIDLoader(knex);
  return new Dataloader(async (keys: number[]) => {
    const items: table_product_sku[] = await knex
      .table<table_product_sku>("product_sku")
      .whereIn("id", keys)
      .where("is_active", "=", true);

    return keys.map((row) => {
      const find = items.find((f) => f.id === row);
      if (find) {
        return {
          id: find.id,
          unit: find.unit,
          price: find.price,
          discount: find.discount,
          name: find.name,
          image: find.image,
          status: find.status,
          product: () => loaderProduct.load(find.product_id),
        };
      }
      return null;
    });
  });
}
