import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("addon_products", function (table) {
    table.increments("id").primary();
    table.integer("product_id").index();
    table.string("name");
    table.string("value");
    table.boolean("is_required");
  });
}

export async function down(knex: Knex): Promise<void> {}
