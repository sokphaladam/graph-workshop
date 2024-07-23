import { Knex } from "knex";
import { createRoleLoader } from "./RoleLoader";

export function createDataLoader(Knex: Knex) {
  return {
    roleLoader: createRoleLoader(Knex),
  };
}
