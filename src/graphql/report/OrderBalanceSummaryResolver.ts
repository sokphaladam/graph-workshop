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
    .sum("total_paid as total")
    .first();

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
    order: order.total || 0,
    product: products.count || 0,
    staff: staff.count || 0,
  };
}
