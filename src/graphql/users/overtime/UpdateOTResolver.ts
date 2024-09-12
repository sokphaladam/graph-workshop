import { ContextType } from "src/ContextType";
import { table_staff_overtime, table_user_leave } from "src/generated/tables";
import { CreateActivity } from "../activity/ActivityResolver";
import { Formatter } from "src/lib/Formatter";

export async function UpdateOTResolver(_, { data, id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  const input: table_staff_overtime = {
    ot_from: data.startat,
    ot_to: data.endAt,
    ot_date: data.otDate,
    note: data.note,
  };

  await knex.transaction(async (tx) => {
    const item = await tx.table("staff_overtime").where({ id }).first();
    await tx.table("staff_overtime").where({ id }).update(input);
    await CreateActivity(
      _,
      {
        data: {
          userId: item.user_id,
          type: "OT",
          description: `Update request OT by ${user.display}`,
        },
      },
      { knex: { default: tx } }
    );
  });

  return true;
}
