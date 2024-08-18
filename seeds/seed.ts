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
  await knex("category").del();
  await knex("products").del();
  await knex("product_sku").del();
  await knex("addon_products").del();

  // Inserts seed entries
  await knex<table_role_users>("role_users").insert([
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "User" },
    { id: 4, name: "Kitchen" },
  ]);

  const pwd1 = (await knex.select(knex.raw(`md5("5up3r@ol!m") as pwd`)).first())
    .pwd;
  const pwd2 = (await knex.select(knex.raw(`md5("@ol!m") as pwd`)).first()).pwd;
  const pwd3 = (await knex.select(knex.raw(`md5("ol3fu@l") as pwd`)).first())
    .pwd;
  const pwd4 = (await knex.select(knex.raw(`md5("k!tch3n") as pwd`)).first())
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
    }
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
  await knex<table_products>("products").insert([
    {
      id: 1,
      type: "PRODUCTION",
      title: "Ice Chocolate",
      description: "For ref only: Lightly sweet and a little bready",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311390.jpg?alt=media&token=343073e5-6f01-41bb-9544-840df0e71e15",
      code: "IDHJYFXWF",
      category_id: 2,
    },
    {
      id: 2,
      type: "PRODUCTION",
      title: "Iced Coffee Latte",
      description: "For ref only: A drink to keep you awake",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311385.jpg?alt=media&token=bf22ac48-ae2d-4980-b860-afe4a6ca289b",
      code: "IVYUDHXWF",
      category_id: 2,
    },
    {
      id: 3,
      type: "PRODUCTION",
      title: "Ice Matcha Latte",
      description:
        "For ref only: An iced matcha latte flavoured with a delicious brown sugar syrup",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311400.jpg?alt=media&token=50f6a6f7-67b9-4dc3-82ee-76b865880013",
      code: "IWTEUIXWF",
      category_id: 5,
    },
    {
      id: 4,
      type: "PRODUCTION",
      title: "Thai Milk Tea",
      description:
        "For ref only: A perfect balance between Thai tea and the sweetness of the milk",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311407.jpg?alt=media&token=013e2908-38b7-4b72-9e11-4f5206bfd3c1",
      code: "TYHIYIXWF",
      category_id: 5,
    },
    {
      id: 5,
      type: "PRODUCTION",
      title: "Matcha Milkshake",
      description: "",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311408.jpg?alt=media&token=4176b9f6-772b-4f21-b298-f7b962eb4aa4",
      code: "MRMHCJXWF",
      category_id: 5,
    },
    {
      id: 6,
      type: "PRODUCTION",
      title: "Hot Double Expresso",
      description: "For ref only: Fresh coconut with double espresso",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311378.jpg?alt=media&token=15e44480-9835-404d-8cfd-f6e6f2a0c02b",
      code: "HQYJSDMXF",
      category_id: 1,
    },
    {
      id: 7,
      type: "PRODUCTION",
      title: "Hot Americano",
      description:
        "For ref only: Is an espresso​ based drink designed to resemble coffee brewed in a drip filter",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311379.jpg?alt=media&token=95221e68-87d0-40eb-8990-b4ef24373d0a",
      code: "HZBTXDMXF",
      category_id: 1,
    },
    {
      id: 8,
      type: "PRODUCTION",
      title: "Hot Coffee Latte",
      description:
        "For ref only: A perfect balance between coffee and the sweetness of the milk",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311380.jpg?alt=media&token=9c844988-b4f6-4b65-8b18-907a2c00564e",
      code: "HOASAEMXF",
      category_id: 1,
    },
    {
      id: 9,
      type: "PRODUCTION",
      title: "Caramel Frappe",
      description:
        "For ref only: Blended caramel and milk to the smooth consistency",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311393.jpg?alt=media&token=60286d94-4995-4671-bd95-2492174cf5c7",
      code: "CEMEEEMXF",
      category_id: 3,
    },
    {
      id: 10,
      type: "PRODUCTION",
      title: "Coffee Frappe",
      description: "For ref only: Espresso milk sugar and vanilla in a blender",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311394.jpg?alt=media&token=e3e83ba3-8f01-4afd-936a-c34918387798",
      code: "CFPNHEMXF",
      category_id: 3,
    },
    {
      id: 11,
      type: "PRODUCTION",
      title: "Mocha Frappe",
      description:
        "For ref only: Blended mocha and milk to the smooth consistency",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311395.jpg?alt=media&token=8aa70fca-89a9-44d1-ab9a-6bfb5d7148bc",
      code: "MISCKEMXF",
      category_id: 3,
    },
    {
      id: 12,
      type: "PRODUCTION",
      title: "Yuzu Sparkling Tea",
      description: "",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311744.jpg?alt=media&token=70b3e708-f447-4c55-ab6f-cd84dc1f12bd",
      code: "YDJYMEMXF",
      category_id: 4,
    },
    {
      id: 13,
      type: "PRODUCTION",
      title: "Honey lemon Tea",
      description:
        "For ref only: A perfect balance between tea sweetness of honey and sourness of lemon",
      images:
        "https://firebasestorage.googleapis.com/v0/b/files-98ece.appspot.com/o/images%2F3311403.jpg?alt=media&token=e3503244-0e87-4c80-8945-feaec9db9b58",
      code: "HIOJPEMXF",
      category_id: 4,
    },
  ]);
  await knex.table("product_sku").insert([
    {
      id: 5,
      product_id: 2,
      unit: "CUP",
      name: "Regular",
      price: 1.62,
      discount: 0.0,
    },
    {
      id: 6,
      product_id: 1,
      unit: "CUP",
      name: "Regular",
      price: 1.62,
      discount: 0.0,
    },
    {
      id: 7,
      product_id: 3,
      unit: "CUP",
      name: "Regular",
      price: 2.61,
      discount: 0.0,
    },
    {
      id: 8,
      product_id: 4,
      unit: "CUP",
      name: "M",
      price: 1.62,
      discount: 0.0,
    },
    {
      id: 9,
      product_id: 5,
      unit: "CUP",
      name: "M",
      price: 1.62,
      discount: 0.0,
    },
    {
      id: 10,
      product_id: 6,
      unit: "CUP",
      name: "M",
      price: 0.9,
      discount: 0.0,
    },
    {
      id: 11,
      product_id: 7,
      unit: "CUP",
      name: "M",
      price: 0.9,
      discount: 0.0,
    },
    {
      id: 12,
      product_id: 8,
      unit: "CUP",
      name: "M",
      price: 0.9,
      discount: 0.0,
    },
    {
      id: 13,
      product_id: 9,
      unit: "CUP",
      name: "Regular",
      price: 2.25,
      discount: 0.0,
    },
    {
      id: 14,
      product_id: 10,
      unit: "CUP",
      name: "Regular",
      price: 2.25,
      discount: 0.0,
    },
    {
      id: 15,
      product_id: 11,
      unit: "CUP",
      name: "Regular",
      price: 2.25,
      discount: 0.0,
    },
    {
      id: 16,
      product_id: 12,
      unit: "CUP",
      name: "M",
      price: 1.62,
      discount: 0.0,
    },
    {
      id: 17,
      product_id: 13,
      unit: "CUP",
      name: "M",
      price: 1.62,
      discount: 0.0,
    },
  ]);

  await knex.table("addon_products").insert([
    {
      id: 1,
      product_id: 1,
      name: "Ice lvl",
      value: "25%,50%,75%,100%",
      is_required: 1,
    },
    {
      id: 2,
      product_id: 1,
      name: "Sugar",
      value: "20%,30%,50%,75%",
      is_required: 1,
    },
    {
      id: 5,
      product_id: 2,
      name: "Sugar",
      value: "50%,75%,100%",
      is_required: 1,
    },
    {
      id: 3,
      product_id: 3,
      name: "Sugar",
      value: "50%,75%,100%",
      is_required: 1,
    },
    {
      id: 4,
      product_id: 3,
      name: "Ice Level",
      value: "50%,75%,100%",
      is_required: 0,
    },
  ]);
}
