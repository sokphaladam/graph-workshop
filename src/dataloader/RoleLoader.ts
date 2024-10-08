import { Knex } from "knex";
import Dataloader from "dataloader";
import { Graph } from "src/generated/graph";
import { table_role_users } from "src/generated/tables";

export function createRoleLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const roles: table_role_users[] = await knex
      .table<table_role_users>("role_users")
      .whereIn("id", keys);
    return roles.map((x) => {
      return {
        id: x.id,
        name: x.name,
      };
    });
  });
}

export function createRoleByIdLoader(knex: Knex) {
  return new Dataloader(async (keys: number[]) => {
    const roles: table_role_users[] = await knex
      .table<table_role_users>("role_users")
      .whereIn("id", keys);

    return keys.map((row) => {
      const find = roles.find((f) => f.id === row);

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        name: find.name,
      };
    });
  });
}
