import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "../OrderResolver";

export async function RemoveOrderItemResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).update("status", status);

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", 1);

  return true;
}

export async function DecreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", -1);

  return true;
}