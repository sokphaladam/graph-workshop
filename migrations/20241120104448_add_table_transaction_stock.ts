import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable("transaction_stock", function (table) {
    table.increments("id").primary();
    table.integer("stock_id").index();
    table.string("transaction_type");
    table.float("qty");
    table.integer("transaction_by").index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
