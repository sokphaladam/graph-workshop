import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_activity", function (table) {
    table.increments("id").primary();
    table.integer("user_id").index();
    table.string("type");
    table.text("description");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
