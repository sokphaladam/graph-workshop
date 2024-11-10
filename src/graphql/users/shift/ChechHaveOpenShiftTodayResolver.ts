import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function CheckHaveOpenShiftTodayResolver(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("shift")
    .whereRaw(
      `
    DATE(shift.open) = :open
    AND shift.close IS NULL`,
      { open: Formatter.getNowDate() }
    )
    .first();

  if (!item) {
    return false;
  }

  return true;
}
