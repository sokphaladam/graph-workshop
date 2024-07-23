import Knex from "knex";
import { envconfig } from "./envconfig";

export const knex = Knex({
  client: "mysql2",
  connection: envconfig.db,
});
