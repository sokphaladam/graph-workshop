import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transaction_stock", function (table) {
    table.string("id").primary();
    table.integer("product_id").index();
    table.integer("sku_id").index();
    table.string("transaction_type");
    table.float("qty");
    table.integer("transaction_by").index();
    table.text("description");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
