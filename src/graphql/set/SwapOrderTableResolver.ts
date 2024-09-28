import { ContextType } from "src/ContextType";
import { table_orders } from "src/generated/tables";
import { CreateActivity } from "../users/activity/ActivityResolver";

export async function SwapOrderTableResolver(
  _,
  { orderId, table },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const items = await knex
    .table("orders")
    .where({ set: table })
    .whereIn("status", ["0", "1", "2"])
    .first();

  if (items) {
    console.log("not avaible");
    return false;
  }

  const currentTable: table_orders = await knex
    .table("orders")
    .where({ id: orderId })
    .first();

  if (currentTable) {
    const input = {
      set: table,
      uuid: `${table}@${currentTable.uuid.split("@")[1]}`,
    };
    await knex.table("orders").where({ id: orderId }).update(input);
    await CreateActivity(
      _,
      {
        data: {
          userId: ctx.auth.id,
          type: "SWAP_ORDER_TABLE",
          description: JSON.stringify(input),
        },
      },
      ctx
    );
    return true;
  }

  return false;
}
