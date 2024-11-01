import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_schedule", function (table) {
    table.increments("id").primary().index();
    table.string("name");
    table.time("start_at");
    table.time("end_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
