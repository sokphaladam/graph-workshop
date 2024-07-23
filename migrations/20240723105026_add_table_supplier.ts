import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("supplier", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("contact");
    table.string("prefix");
    table.string("images");
    table.string("address");
    table.timestamps(true, true);
    table.boolean("is_active").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {}
