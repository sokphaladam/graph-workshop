import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("attendance", (table) => {
    table.increments("id").index().primary();
    table.integer("user_id").index();
    table.timestamp("check_in");
    table.timestamp("check_out");
    table.timestamp("overtime_from");
    table.timestamp("overtime_to");
    table.date("check_date");
    table.timestamps(true, true);
    table
      .enum("type", [
        "WORK",
        "ABSENT",
        "LEAVE_REQUEST",
        "LOST_CHECKOUT",
        "DAY_OFF",
      ])
      .defaultTo("WORK");
    table.integer("leave_id").index();
    table.integer("ot_extra").defaultTo(1);
    table.integer("holiday_extra").defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {}
