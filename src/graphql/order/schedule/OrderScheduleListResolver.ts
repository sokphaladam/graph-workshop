import { ContextType } from "src/ContextType";
import { createOrderScheduleItemLoader } from "src/dataloader/OrderScheduleItemLoader";
import { table_order_schedule } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export async function OrderScheduleListResolver(_, {}, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loaderOrderSchedule = createOrderScheduleItemLoader(knex);

  const items: table_order_schedule[] = await knex.table("order_schedule");

  return items.map((x) => {
    return {
      id: x.id,
      name: x.name,
      startAt: x.start_at,
      endAt: x.end_at,
      items: () => loaderOrderSchedule.load(x.id),
    };
  });
}

export async function OrderScheduleIdResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loaderOrderSchedule = createOrderScheduleItemLoader(knex);

  const item: table_order_schedule = await knex
    .table("order_schedule")
    .where({ id })
    .first();

  return {
    id: item.id,
    name: item.name,
    startAt: item.start_at,
    endAt: item.end_at,
    items: () => loaderOrderSchedule.load(item.id),
  };
}
