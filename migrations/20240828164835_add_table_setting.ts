import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("setting", function (table) {
    table.string("option").index();
    table.string("value");
    table.string("type");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
