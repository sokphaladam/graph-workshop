import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("public_holiday", function (table) {
    table.increments("id").index().primary();
    table.string("holiday_name");
    table.dateTime("holiday_date");
    table.integer("extra").defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {}
