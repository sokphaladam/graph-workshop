import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_shift } from "src/generated/tables";

export async function CreateShiftResolver(
  _,
  { data }: { data: Graph.ShiftInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input: table_shift = {
    open: data.open,
    open_usd: String(data.openCurrency.usd),
    open_khr: String(data.openCurrency.khr),
    user_id: data.userId,
    deposit: data.deposit,
    note: data.note,
  };

  await knex.table("shift").insert(input);

  return true;
}
