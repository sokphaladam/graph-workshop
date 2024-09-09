import { ContextType } from "src/ContextType";

export async function AddDiscountOrderResolver(
  _,
  { id, discount },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const order = await knex.table("orders").where({ id }).first();

  if (order) {
    await knex.table("orders").where({ id }).update({ discount: discount });
    return true;
  }

  return false;
}
