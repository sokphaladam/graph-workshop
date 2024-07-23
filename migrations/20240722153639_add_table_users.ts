import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.integer('role_id').index();
    table.string('display_name');
    table.string('username');
    table.string('password');
    table.string('token');
    table.enum('gender', ['Male', 'Female', 'Other']).defaultTo('Other');
    table.string('contact');
    table.boolean('active').defaultTo(false);
    table.dateTime('created_at');
  })
}


export async function down(knex: Knex): Promise<void> {
}

