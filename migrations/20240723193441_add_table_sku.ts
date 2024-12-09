import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("product_sku", function (table) {
    table.increments("id").primary();
    table.integer("product_id").index();
    table.string("unit");
    table.string("name");
    table.decimal("price").defaultTo(0);
    table.decimal("discount").defaultTo(0);
    table.string("image");
    table
      .string("status")
      .comment("AVAILABLE,OUT_OF_STOCK")
      .defaultTo("AVAILABLE");
    table.boolean('is_active').defaultTo(true);
    table.string('enabled_on').defaultTo('ALL').comment('ALL,QORDER,WEB')
  });
}

export async function down(knex: Knex): Promise<void> {}
