import { ContextType } from "src/ContextType";

export async function UpdateHolidayResolver(_, { id, data }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex
    .table("public_holiday")
    .update({
      holiday_name: data.name,
      holiday_date: data.date,
      extra: data.extra,
    })
    .where({ id });

  return true;
}
