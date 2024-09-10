import { ContextType } from "src/ContextType";
import { table_user_leave } from "src/generated/tables";

export async function UpdateLeaveResolver(_, {data, id}, ctx: ContextType){
  const knex = ctx.knex.default;

  const input: table_user_leave = {
    leave_from: data.startDate,
    leave_to: data.endDate,
    leave_status: data.status,
    duration: data.duration,
    leave_reason: data.leaveReason,
    type: data.leaveType,
  }

  await knex.table('user_leave').where({id}).update(input);

  return true;
}