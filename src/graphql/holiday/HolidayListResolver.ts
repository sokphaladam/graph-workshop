import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function HolidayListResolver(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;

  const items = await knex.table("public_holiday");

  return items.map((item) => {
    return {
      id: item.id,
      name: item.holiday_name,
      date: Formatter.date(item.holiday_date),
      extra: item.extra,
    };
  });
}

export async function HolidayByIDResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex.table("public_holiday").where({ id }).first();

  return {
    id: item.id,
    name: item.holiday_name,
    date: Formatter.date(item.holiday_date),
    extra: item.extra,
  };
}
