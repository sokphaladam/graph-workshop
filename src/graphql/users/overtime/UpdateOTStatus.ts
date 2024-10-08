import { ContextType } from "src/ContextType";
import { table_staff_overtime, table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";
import { CreateActivity } from "../activity/ActivityResolver";

export async function UpdateOTStatus(_, { id, status }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  let input: table_staff_overtime = {
    status,
  };

  if (status === "APPROVED") {
    input.approved_by = user.id;
    input.approved_date = Formatter.getNowDateTime();
  }

  if (status === "REJECTED") {
    input.rejected_by = user.id;
    input.rejected_date = Formatter.getNowDateTime();
  }

  if (status === "CANCELLED") {
    input.cancelled_by = user.id;
    input.cancelled_date = Formatter.getNowDateTime();
  }

  await knex.transaction(async (tx) => {
    const item: table_staff_overtime = await tx
      .table("staff_overtime")
      .where({ id })
      .first();
    await tx.table("staff_overtime").where({ id }).update(input);
    if (status === "APPROVED") {
      await tx
        .table("attendance")
        .insert({
          user_id: item.user_id,
          check_date: Formatter.date(item.ot_date),
          overtime_from: Formatter.date(item.ot_date) + " " + item.ot_from,
          overtime_to: Formatter.date(item.ot_date) + " " + item.ot_to,
        })
        .onConflict(["user_id", "check_date"])
        .merge({
          overtime_from: Formatter.date(item.ot_date) + " " + item.ot_from,
          overtime_to: Formatter.date(item.ot_date) + " " + item.ot_to,
        });
    }
    await CreateActivity(
      _,
      {
        data: {
          userId: item.user_id,
          type: "OT",
          description: `Update status OT to ${status} by ${user.display}`,
        },
      },
      { knex: { default: tx } }
    );
  });

  return true;
}
