import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("staff_overtime", (table) => {
    table.increments("id").primary().index();
    table.date("ot_date");
    table.integer("ot_hours");
    table.integer("user_id").index();
    table.integer("created_by").index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
