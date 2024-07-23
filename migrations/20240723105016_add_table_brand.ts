import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("brand", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("logo");
    table.boolean("is_active").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {}
