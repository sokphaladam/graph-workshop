import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function CheckHaveOpenShiftTodayResolver(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth?.id;

  const item = await knex
    .table("shift")
    .where("user_id", user)
    .whereRaw(
      `
    DATE(shift.open) = :open
    AND shift.close IS NULL`,
      { open: Formatter.getNowDate() },
    )
    .first();

  if (!item) {
    return false;
  }

  return true;
}
