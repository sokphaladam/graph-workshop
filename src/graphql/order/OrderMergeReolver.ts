import { ContextType } from "src/ContextType";

export async function OrderMergeReolver(
  _,
  { fromOrderId, toOrderId },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.transaction(async (trx) => {
    await knex
      .table("orders")
      .whereIn("id", fromOrderId)
      .update("status", "4")
      .transacting(trx);

    await knex
      .table("order_items")
      .whereIn("order_id", fromOrderId)
      .update({ order_id: toOrderId })
      .transacting(trx);
  });

  return true;
}
