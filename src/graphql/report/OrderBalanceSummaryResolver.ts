import moment from "moment";
import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function OrderBalanceSummaryResolver(
  _,
  { from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const now = Formatter.getNowDate();

  const order = await knex
    .table("orders")
    .where({ status: "3" })
    .whereRaw("DATE(confirm_checkout_date) BETWEEN :from AND :to", {
      from: from,
      to: to,
    })
    .select(["total_paid", "discount"]);

  const products = await knex
    .table("products")
    .where({ is_active: true })
    .count("* as count")
    .first();
  const staff = await knex
    .table("users")
    .where({ active: true, type: "STAFF" })
    .count("* as count")
    .first();

  return {
    order:
      order.reduce((a, b) => {
        const dis = (Number(b.total_paid) * Number(b.discount)) / 100;
        const am = Number(b.total_paid) - dis;
        return (a = Number(a) + am);
      }, 0) || 0,
    product: products.count || 0,
    staff: staff.count || 0,
  };
}
