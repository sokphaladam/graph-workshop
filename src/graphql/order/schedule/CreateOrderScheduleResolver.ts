import { ContextType } from "src/ContextType";
import {
  table_order_schedule,
  table_order_schedule_detail,
} from "src/generated/tables";

export async function CreateOrderScheduleResolver(
  _,
  { data },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.transaction((tx) => {
    const input: table_order_schedule = {
      name: data.name,
      start_at: data.startAt,
      end_at: data.endAt,
    };

    return tx
      .table("order_schedule")
      .insert(input)
      .then(async (res) => {
        if (res[0]) {
          const details: table_order_schedule_detail[] = data.items.map((x) => {
            return {
              order_schedule_id: res[0],
              sku_id: x.skuId,
            };
          });

          await tx.table("order_schedule_detail").insert(details);
        }
      });
  });

  return true;
}
