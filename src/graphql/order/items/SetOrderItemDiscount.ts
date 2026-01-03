import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function SetOrderItemDiscount(
  _,
  { orderDetailId, discount }: { orderDetailId: number; discount: number },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  await knex
    .table("order_items")
    .where({ id: orderDetailId })
    .update({
      discount: discount,
      updated_by: user ? user.id : null,
      updated_at: Formatter.getNowDateTime(),
    });

  return true;
}
