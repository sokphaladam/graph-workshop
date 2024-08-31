import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_position", (table) => {
    table.increments("id").index().primary();
    table.string("name");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
