import { ContextType } from "src/ContextType";
import { table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";
import { CreateActivity } from "../activity/ActivityResolver";

export async function UpdateLeaveStatus(_, { id, status }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  let input: table_user_leave = {
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
    const item = await tx.table("user_leave").where({ id }).first();
    await tx.table("user_leave").where({ id }).update(input);
    await CreateActivity(
      _,
      {
        data: {
          userId: item.request_by,
          type: "LEAVE",
          description: `Update status request leave to ${status} by ${user.display}`,
        },
      },
      { knex: { default: tx } }
    );
  });

  return true;
}
