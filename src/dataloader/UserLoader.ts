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
        profile: x.profile,
        fromTime: x.from_time,
        toTime: x.to_time,
      };
    });
  });
}

export function createUserByIdLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const users: table_users[] = await knex
      .table<table_users>("users")
      .whereIn("id", keys);

    return keys.map((row) => {
      const find = users.find((f) => f.id === row);

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        display: find.display_name,
        profile: find.profile,
        fromTime: find.from_time,
        toTime: find.to_time,
      };
    });
  });
}
