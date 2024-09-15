import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_product_sku } from "src/generated/tables";

export function createSkuByProductIDLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const items: table_product_sku[] = await knex
      .table<table_product_sku>("product_sku")
      .whereIn("product_id", keys);

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
          };
        });
    });
  });
}

export function createSkuByIDLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const items: table_product_sku[] = await knex
      .table<table_product_sku>("product_sku")
      .whereIn("id", keys);

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
        };
      }
      return null;
    });
  });
}
