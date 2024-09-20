import { ContextType } from "src/ContextType";

export async function SetTypePaymentOrderResolver(
  _,
  { id, bankType, currency, bankId },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("orders").where({ id: id }).update({
    bank_type: bankType,
    bank: bankId,
    currency: currency,
  });

  return true;
}
