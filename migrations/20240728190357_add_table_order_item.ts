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
    table.string("addons");
    table.string("remark");
    table
      .string("status")
      .comment(
        "0:PENDING,1:MAKING,2:OUT_OF_STOCK,3:REQUEST_CHANGE,4:COMPLETED,5:DELETED"
      );
    table.boolean("is_print").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
