import { ContextType } from "src/ContextType";

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
