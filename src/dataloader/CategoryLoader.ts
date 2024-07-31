import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_category } from "src/generated/tables";

export function createCategoryLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const items: table_category[] = await knex
      .table<table_category>("category")
      .where("is_active", true)
      .whereIn("id", keys);

    return keys.map((key) => {
      const find = items.find((f) => f.id === key);
      if (!find) {
        return null;
      }
      return {
        id: find.id,
        name: find.name,
        root: find.root,
      };
    });
  });
}
