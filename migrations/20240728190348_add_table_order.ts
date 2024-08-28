import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id").primary().index();
    table.string("uuid").index();
    table.string("set").index();
    table.integer("order");
    table
      .string("status")
      .comment("0:PENDING,1:VERIFY,2:DELIVERY,3:CHECKOUT,4:CANCELLED");
    table.string("customer_number");
    table.string("address");
    table.decimal("total");
    table.decimal("total_paid");
    table.decimal("vat");
    table.string("note");
    table.timestamp("verify_date");
    table.integer("verify_by");
    table.timestamp("deliver_date");
    table.integer("deliver_by");
    table.timestamp("confirm_checkout_date");
    table.integer("confirm_checkout_by");
    table.timestamp("cancelled_date");
    table.integer("cancelled_by");
    table.string("verify_code");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
