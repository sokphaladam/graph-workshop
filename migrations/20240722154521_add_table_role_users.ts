import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('role_users', function(table){
    table.increments('id').primary();
    table.string('name');
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
}

