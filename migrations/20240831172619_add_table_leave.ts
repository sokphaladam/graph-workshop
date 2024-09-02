import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_leave", (table) => {
    table.increments("id").primary().index();
    table.time("leave_from");
    table.time("leave_to");
    table.string("leave_reason");
    table
      .string("status")
      .comment("REQUEST, APPROVED, REJECTED")
      .defaultTo("REQUEST");
    table.enum("type", ["AL", "SL", "DO"]);
    table.integer("approved_by");
    table.integer("request_by");
    table.integer("rejected_by");
    table.dateTime("approved_date");
    table.dateTime("request_date");
    table.dateTime("rejected_date");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
