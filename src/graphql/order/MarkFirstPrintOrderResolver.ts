import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function MarkFirstPrintOrderResolver(
  _,
  { orderId },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("orders").where({ id: orderId }).update({
    first_print: true,
  });

  return true;
}

export async function setPrintOrderItemToKitchen(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("order_items").where({ id }).update({
    is_print: false,
    printed_at: Formatter.getNowDateTime(),
  });

  return true;
}
