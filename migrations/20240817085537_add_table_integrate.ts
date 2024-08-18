import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("product_integrate", function (table) {
    table.increments("id").primary();
    table.integer("product_id").index();
    table.integer("integrate_id").index();
    table.string("qty");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
