import { ContextType } from "src/ContextType";
import { StatusOrder } from "./OrderResolver";

export async function GenerateTokenOrderResolver(
  _,
  { set }: { set: number },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  return await knex.transaction(async (tx) => {
    const item = await tx
      .table("orders")
      .where({ set, status: StatusOrder.PENDING })
      .first();

    if (item) {
      return item.uuid;
    }

    const uuid = set + "@" + new Date().getTime();

    const res = await tx.table("orders").insert({
      uuid,
      customer_number: "",
      set,
      status: StatusOrder.PENDING,
      order: 0,
      total: "0",
      total_paid: "0",
    });

    return res[0] > 0 ? uuid : null;
  });
}
