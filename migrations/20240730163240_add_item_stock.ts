import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("item_stock", function (table) {
    table.increments("id").primary();
    table.integer("product_id").index();
    table.string("name");
    table.string("unit");
    table.string("location");
    table.float("qty");
    table.text("note");
    table.text("proof");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
