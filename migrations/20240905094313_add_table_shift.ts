import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("shift", (table) => {
    table.increments("id").primary().index();
    table.dateTime("open");
    table.dateTime("close");
    table.decimal("open_usd").defaultTo(0);
    table.decimal("open_khr").defaultTo(0);
    table.decimal("close_usd").defaultTo(0);
    table.decimal("close_khr").defaultTo(0);
    table.decimal("deposit").defaultTo(0);
    table.string("note");
  });
}

export async function down(knex: Knex): Promise<void> {}
