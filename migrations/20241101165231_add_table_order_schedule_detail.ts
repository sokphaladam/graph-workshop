import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_schedule_detail", function (table) {
    table.integer("order_schedule_id").index();
    table.integer("sku_id").index();
    table.primary(["order_schedule_id", "sku_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
