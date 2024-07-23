import { Knex } from "knex";
import {
  table_category,
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
      name: "Drink",
      root: 0,
    },
    {
      id: 2,
      name: "Food",
      root: 0,
    },
    {
      id: 3,
      name: "Caffe",
      root: 1,
    },
    {
      id: 4,
      name: "Soft Drink",
      root: 1,
    },
    {
      id: 5,
      name: "Bread",
      root: 2,
    },
    {
      id: 6,
      name: "Sweet",
      root: 2,
    },
    {
      id: 7,
      name: "Burger",
      root: 5,
    },
    {
      id: 8,
      name: "Pizza",
      root: 5,
    },
  ]);
}
