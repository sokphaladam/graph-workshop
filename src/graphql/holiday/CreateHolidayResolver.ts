import { ContextType } from "src/ContextType";

export async function CreateHolidayResolver(_, { data }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("public_holiday").insert({
    holiday_name: data.name,
    holiday_date: data.date,
    extra: data.extra,
  });

  return true;
}
