import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_category } from "src/generated/tables";

export function createCategoryLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const items: table_category[] = await knex
      .table<table_category>("category")
      .where("is_active", true)
      .whereIn("id", keys);
    return items.map((x) => {
      return {
        id: x.id,
        name: x.name,
        root: x.root,
      };
    });
  });
}
