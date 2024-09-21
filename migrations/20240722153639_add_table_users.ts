import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.integer("role_id").index();
    table.string("display_name");
    table.string("username");
    table.string("password");
    table.string("token");
    table.enum("gender", ["Male", "Female", "Other"]).defaultTo("Other");
    table.string("contact");
    table.string("owner_identity");
    table.boolean("active").defaultTo(false);
    table.dateTime("created_at");
    table.string("dob");
    table.string("starting_at");
    table.string("bank_name");
    table.string("bank_account");
    table.string("bank_type");
    table.string("profile");
    table.string("position");
    table.string("base_salary");
    table.string("type").comment("SYS, STAFF");
    table.time("from_time").defaultTo("08:00");
    table.time("to_time").defaultTo("17:00");
    table.boolean('is_reset_password').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {}
