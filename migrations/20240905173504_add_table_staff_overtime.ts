import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("staff_overtime", (table) => {
    table.increments("id").primary().index();
    table.date("ot_date");
    table.time("ot_from");
    table.time("ot_to");
    table.string("note");
    table
      .string("status")
      .comment("REQUEST, APPROVED, REJECTED, CANCEL")
      .defaultTo("REQUEST");
    table.integer("user_id").index();
    table.integer("approved_by").index();
    table.integer("request_by").index();
    table.integer("rejected_by").index();
    table.dateTime("approved_date");
    table.dateTime("request_date");
    table.dateTime("rejected_date");
    table.dateTime("cancelled_date");
    table.integer("cancelled_by").index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
