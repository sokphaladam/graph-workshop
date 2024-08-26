import { ContextType } from "src/ContextType";
import { sendNotification } from "./AddOrderItemResolver";

export async function RemoveOrderItemResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  await knex.table("order_items").where("id", id).update("status", status);
  sendNotification({}, "change status", ctx.auth);

  return true;
}

export async function IncreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", 1);
  sendNotification({}, `Change qty (+)`, ctx.auth);

  return true;
}

export async function DecreaseOrderItemResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where("id", id).increment("qty", -1);
  sendNotification({}, `Change qty (-)`, ctx.auth);

  return true;
}
