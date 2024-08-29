import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("table_set", (table) => {
    table.integer("set").primary().index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
