import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id").primary();
    table.string("uuid");
    table.string("set");
    table.integer("order");
    table.string("status").comment("0:PENDING,1:VERIFY,2:DELIVERY,3:CHECKOUT");
    table.string("customer_number");
    table.string("address");
    table.decimal("total");
    table.decimal("total_paid");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
