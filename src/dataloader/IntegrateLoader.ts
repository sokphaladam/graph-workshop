import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_product_integrate } from "src/generated/tables";
import { createProductByIDLoader } from "./ProductLoader";

export function createIntegrateByProductIDLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const productLoader = createProductByIDLoader(knex);
    const items: table_product_integrate[] = await knex
      .table<table_product_integrate>("product_integrate")
      .whereIn("product_id", keys);

    return keys.map((row) => {
      return items
        .filter((x) => x.product_id === row)
        .map((x) => {
          return {
            id: x.id,
            product: () => productLoader.load(x.product_id),
            integrate: () => productLoader.load(x.integrate_id),
            qty: x.qty
          };
        });
    });
  });
}
