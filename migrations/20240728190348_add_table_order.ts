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
    table.float("total");
    table.float("total_paid");
    table.float("vat");
    table.string("note");
    table.dateTime("verify_date");
    table.integer("verify_by").index();
    table.dateTime("deliver_date");
    table.integer("deliver_by").index();
    table.dateTime("confirm_checkout_date");
    table.integer("confirm_checkout_by").index();
    table.dateTime("cancelled_date");
    table.integer("cancelled_by").index();
    table.string("verify_code");
    table.integer("delivery_id").index();
    table.string("delivery_code");
    table.integer("signature_by").index();
    table.dateTime("signature_date");
    table.timestamps(true, true);
    table.integer("invoice");
    table.string("bank_type");
    table.integer("bank").index();
    table.string("currency").defaultTo("USD");
    table.integer("person");
    table.float("discount").defaultTo(0);
    table.float("customer_paid").defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
