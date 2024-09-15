import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("category", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("logo");
    table.integer("root").index();
    table.boolean("is_active").defaultTo(true);
    table.integer("index").defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
