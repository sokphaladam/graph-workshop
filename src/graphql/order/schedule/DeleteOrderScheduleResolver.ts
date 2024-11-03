import { ContextType } from "src/ContextType";

export async function DeleteOrderScheduleResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.transaction((tx) => {
    return tx
      .table("order_schedule_detail")
      .where({ order_schedule_id: id })
      .del()
      .then(async () => {
        await tx.table("order_schedule").where({ id }).del();
      });
  });

  return true;
}
