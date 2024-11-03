import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_order_schedule } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export async function UpdateOrderScheduleResolver(
  _,
  { id, data }: { id: number; data: Graph.OrderScheduleInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const item = await knex.table("order_schedule").where({ id }).first();

  if (item) {
    const details = await knex
      .table("order_schedule_detail")
      .where({ order_schedule_id: id });

    const input: table_order_schedule = {
      name: data.name,
      start_at: data.startAt as any,
      end_at: data.endAt as any,
      updated_at: Formatter.getNowDateTime() as any,
    };

    const newItems = data.items.filter(
      (x) => !details.map((d) => d.sku_id).includes(x.skuId)
    );
    const removeItems = details.filter(
      (x) => !data.items.map((d) => d.skuId).includes(x.sku_id)
    );

    await knex.transaction((tx) => {
      return tx
        .table("order_schedule")
        .where({ id })
        .update(input)
        .then(async () => {
          if (removeItems.length > 0) {
            await tx
              .table("order_schedule_detail")
              .where({ order_schedule_id: id })
              .whereIn(
                "sku_id",
                removeItems.map((x) => x.sku_id)
              )
              .del();
          }

          if (newItems.length > 0) {
            await tx.table("order_schedule_detail").insert(
              newItems.map((x) => {
                return { order_schedule_id: id, sku_id: x.skuId };
              })
            );
          }
        });
    });
  }

  return true;
}
