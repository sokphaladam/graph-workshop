import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";
import { CreateActivity } from "../activity/ActivityResolver";

export async function CreateLeaveResolver(
  _,
  { data, userId }: { data: Graph.LeaveInput; userId: number },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const today = Formatter.getNowDateTime();

  const input: table_user_leave = {
    leave_from: data.startDate,
    leave_to: data.endDate,
    leave_status: data.status,
    duration: data.duration,
    leave_reason: data.leaveReason,
    type: data.leaveType,
    request_by: userId,
    request_date: today,
  };

  await knex.table("user_leave").insert(input);
  await CreateActivity(
    _,
    {
      data: {
        userId: userId,
        type: "LEAVE",
        description: `Request leave`,
      },
    },
    ctx
  );
  return true;
}
