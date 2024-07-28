import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_items", function (table) {
    table.increments("id").primary();
    table.integer("order_id").index();
    table.integer("sku_id").index();
    table.integer("product_id").index();
    table.integer("qty");
    table.decimal("price");
    table.decimal("discount");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
