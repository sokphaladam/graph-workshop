import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("shift", (table) => {
    table.increments("id").primary().index();
    table.dateTime("open");
    table.dateTime("close");
    table.string("open_usd").defaultTo(0);
    table.string("open_khr").defaultTo(0);
    table.string("close_usd").defaultTo(0);
    table.string("close_khr").defaultTo(0);
    table.string("expect_usd").defaultTo(0);
    table.string("expect_khr").defaultTo(0);
    table.string("deposit").defaultTo(0);
    table.string("note");
    table.string("bank");
    table.string("bill");
    table.string("card");
    table.string("customer");
    table.string("customer_cost_avg");
    table.integer("user_id").index();
  });
}

export async function down(knex: Knex): Promise<void> {}
