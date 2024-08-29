import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("delivery", (table) => {
    table.increments("id").primary().index();
    table.string("name");
    table.string("contact");
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
