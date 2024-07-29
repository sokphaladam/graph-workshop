import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_addon_products } from "src/generated/tables";

export function createAddonByProductIDLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const items: table_addon_products[] = await knex
      .table<table_addon_products>("addon_products")
      .whereIn("product_id", keys);

    return keys.map((row) => {
      return items
        .filter((x) => x.product_id === row)
        .map((x) => {
          return {
            id: x.id,
            name: x.name,
            value: x.value,
            isRequired: x.is_required,
          };
        });
    });
  });
}
