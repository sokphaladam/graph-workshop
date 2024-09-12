import { ContextType } from "src/ContextType";
import { table_user_leave } from "src/generated/tables";
import { CreateActivity } from "../activity/ActivityResolver";
import { Formatter } from "src/lib/Formatter";

export async function UpdateLeaveResolver(_, { data, id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  const input: table_user_leave = {
    leave_from: data.startDate,
    leave_to: data.endDate,
    leave_status: data.status,
    duration: data.duration,
    leave_reason: data.leaveReason,
    type: data.leaveType,
  };

  await knex.transaction(async (tx) => {
    const item = await tx.table("user_leave").where({ id }).first();
    await tx.table("user_leave").where({ id }).update(input);
    await CreateActivity(
      _,
      {
        data: {
          userId: item.request_by,
          type: "LEAVE",
          description: `Update request leave by ${user.display}`,
        },
      },
      { knex: { default: tx } }
    );
  });

  return true;
}
