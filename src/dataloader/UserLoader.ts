import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_users } from "src/generated/tables";

export function createUserLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const roles: table_users[] = await knex
      .table<table_users>("users")
      .whereIn("id", keys);
    return roles.map((x) => {
      return {
        id: x.id,
        display: x.display_name,
      };
    });
  });
}
