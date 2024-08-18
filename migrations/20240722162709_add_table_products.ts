import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("code").index();
    table.string("title");
    table.text("description");
    table.decimal("price").defaultTo(0);
    table.decimal("sale_price").defaultTo(0);
    table.decimal("discount").defaultTo(0);
    table.string("color");
    table.string("size");
    table.string("unit");
    table.integer("category_id").index();
    table.integer("brand_id").index();
    table.integer("supplier_id").index();
    table.bigInteger("current_qty").defaultTo(0);
    table.string("type").comment("PRODUCTION,RAW,ADDON,FREEZING,SECOND_HAND");
    table.string("images");
    table.boolean("is_active").defaultTo(true);
    table.string("weight");
    table.string("width");
    table.string("height");
    table.string("length");
    table.float("stock").defaultTo(0);
    table.float("stock_alter").defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
