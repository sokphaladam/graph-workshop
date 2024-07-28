import { Knex } from "knex";
import {
  table_category,
  table_products,
  table_role_users,
  table_users,
} from "../src/generated/tables";
import { randomBytes } from "crypto";
import moment from "moment";

function getToken() {
  return randomBytes(48).toString("hex");
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("role_users").del();
  await knex("users").del();
  await knex("category").del();
  await knex("products").del();
  await knex("product_sku").del();

  // Inserts seed entries
  await knex<table_role_users>("role_users").insert([
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "User" },
  ]);

  const pwd1 = (await knex.select(knex.raw(`md5("123456") as pwd`)).first())
    .pwd;
  const pwd2 = (await knex.select(knex.raw(`md5("12345") as pwd`)).first()).pwd;
  const pwd3 = (await knex.select(knex.raw(`md5("1234") as pwd`)).first()).pwd;

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
  ];

  await knex<table_users>("users").insert(users);
  await knex<table_category>("category").insert([
    {
      id: 1,
      name: "Hot",
      root: 0,
    },
    {
      id: 2,
      name: "Iced",
      root: 0,
    },
    {
      id: 3,
      name: "Frappe",
      root: 0,
    },
    {
      id: 4,
      name: "Smoothies",
      root: 0,
    },
    {
      id: 5,
      name: "Soda",
      root: 0,
    },
  ]);
}
