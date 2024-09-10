import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_leave", (table) => {
    table.increments("id").primary().index();
    table.dateTime("leave_from");
    table.dateTime("leave_to");
    table.string("leave_reason");
    table.integer("duration");
    table
      .string("status")
      .comment("REQUEST, APPROVED, REJECTED, CANCEL")
      .defaultTo("REQUEST");
    table.string("type");
    table.integer("approved_by").index();
    table.integer("request_by").index();
    table.integer("rejected_by").index();
    table.dateTime("approved_date");
    table.dateTime("request_date");
    table.dateTime("rejected_date");
    table.dateTime("cancelled_date");
    table.dateTime("cancelled_by").index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
