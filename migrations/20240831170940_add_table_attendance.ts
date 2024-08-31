import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("attendance", (table) => {
    table.increments("id").index().primary();
    table.integer("user_id").index();
    table.time("check_in");
    table.time("check_out");
    table.time("overtime_from");
    table.time("overtime_to");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
