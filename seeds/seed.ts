import { Knex } from "knex";
import {
  table_category,
  table_products,
  table_role_users,
  table_users,
} from "../src/generated/tables";
import { randomBytes } from "crypto";
import moment from "moment";
import { table } from "console";

function getToken() {
  return randomBytes(48).toString("hex");
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("role_users").del();
  await knex("users").del();
  await knex("setting").del();

  // Inserts seed entries
  await knex<table_role_users>("role_users").insert([
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "User" },
    { id: 4, name: "Kitchen" },
  ]);

  const pwd1 = (await knex.select(knex.raw(`md5('5up3r@ol!m') as pwd`)).first())
    .pwd;
  const pwd2 = (await knex.select(knex.raw(`md5('@ol!m') as pwd`)).first()).pwd;
  const pwd3 = (await knex.select(knex.raw(`md5('ol3fu@l') as pwd`)).first())
    .pwd;
  const pwd4 = (await knex.select(knex.raw(`md5('k!tch3n') as pwd`)).first())
    .pwd;

  const users: table_users[] = [
    {
      id: 1,
      display_name: "Super Admin",
      contact: "",
      username: "super_admin",
      password: pwd1,
      gender: "Other",
      role_id: 1,
      token: `SA${getToken()}`,
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      active: 1,
    },
    {
      id: 2,
      display_name: "Admin",
      contact: "",
      username: "admin",
      password: pwd2,
      gender: "Other",
      role_id: 2,
      token: `AD${getToken()}`,
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      active: 1,
    },
    {
      id: 3,
      display_name: "Default Users",
      contact: "",
      username: "user",
      password: pwd3,
      gender: "Other",
      role_id: 3,
      token: `DU${getToken()}`,
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      active: 1,
    },
    {
      id: 4,
      display_name: "Kitchen",
      contact: "",
      username: "kitchen",
      password: pwd4,
      gender: "Other",
      role_id: 4,
      token: `KC${getToken()}`,
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      active: 1,
    },
  ];

  const settings = [
    {
      option: "TAX",
      value: "0",
      type: "PERCENTAGE",
    },
    {
      option: "EXCHANGE_RATE",
      value: "0",
      type: "NUMBER",
    },
  ];

  await knex<table_users>("users").insert(users);
  await knex("setting").insert(settings);
}
