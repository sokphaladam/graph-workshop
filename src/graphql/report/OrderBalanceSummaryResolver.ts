import moment from "moment";
import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function OrderBalanceSummaryResolver(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;

  const now = Formatter.getNowDate();

  const order = await knex
    .table("orders")
    .where({ status: "3" })
    .whereRaw("DATE(confirm_checkout_date) = :date", { date: now })
    .sum("total_paid");

  console.log(order);

  return {};
}
