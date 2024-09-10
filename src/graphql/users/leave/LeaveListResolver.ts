import moment, { duration } from "moment";
import { ContextType } from "src/ContextType";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export async function LeaveListResolver(_, {limit, offset, status, from ,end}, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;
  const loaderUser = createUserByIdLoader(knex);

  const query = knex.table('user_leave');
  
  if(status && status.length > 0) {
    query.whereIn('status', status);
  }

  if(from && end) {
    query.whereBetween('request_date', [from, end])
  }

  if(user) {
    if(![1,2,6].includes(user.role.id)) {
      query.where('request_by', user.id);
    }
  }

  const items: table_user_leave[] = await query.clone().limit(limit).offset(offset);

  return items.map(item => {
    return {
      id: item.id,
      startDate: Formatter.dateTime(item.leave_from),
      endDate: Formatter.dateTime(item.leave_to),
      leaveType: item.type,
      leaveReason: item.leave_reason,
      duration: item.duration,
      status: item.status,
      approvedDate: item.approved_date ? Formatter.dateTime(item.approved_date): null,
      approvedBy: item.approved_by ? ()=> loaderUser.load(item.approved_by) : null,
      requestedBy: item.request_by ? ()=> loaderUser.load(item.request_by) : null,
      requestedDate: item.request_date ? Formatter.dateTime(item.request_date): null,
      rejectedBy: item.rejected_by ? ()=> loaderUser.load(item.rejected_by) : null,
      rejectedDate: item.rejected_date ? Formatter.dateTime(item.rejected_date): null,
      cancelledDate: item.cancelled_date ? Formatter.dateTime(item.cancelled_date): null,
      cancelledBy: item.cancelled_by ? ()=> loaderUser.load(item.cancelled_by) : null
    }
  })
}

export async function LeaveById(_, {id}, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loaderUser = createUserByIdLoader(knex);

  const item: table_user_leave = await knex.table('user_leave').where({id}).first();

  return {
    id: item.id,
    startDate: Formatter.dateTime(item.leave_from),
    endDate: Formatter.dateTime(item.leave_to),
    leaveType: item.type,
    leaveReason: item.leave_reason,
    duration: item.duration,
    status: item.status,
    approvedDate: item.approved_date ? Formatter.dateTime(item.approved_date): null,
    approvedBy: item.approved_by ? ()=> loaderUser.load(item.approved_by) : null,
    requestedBy: item.request_by ? ()=> loaderUser.load(item.request_by) : null,
    requestedDate: item.request_date ? Formatter.dateTime(item.request_date): null,
    rejectedBy: item.rejected_by ? ()=> loaderUser.load(item.rejected_by) : null,
    rejectedDate: item.rejected_date ? Formatter.dateTime(item.rejected_date): null,
    cancelledDate: item.cancelled_date ? Formatter.dateTime(item.cancelled_date): null,
    cancelledBy: item.cancelled_by ? ()=> loaderUser.load(item.cancelled_by) : null
  }
}