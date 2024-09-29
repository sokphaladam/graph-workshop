import moment from "moment";
import { ContextType } from "src/ContextType";
import { createLeaveByIdDateLoader } from "src/dataloader/LeaveLoader";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { table_attendance, table_users } from "src/generated/tables";

export async function AttendanceAdminListResolver(
  _,
  { offset, limit, month, year },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const loader = createUserByIdLoader(knex);
  const loaderLeave = createLeaveByIdDateLoader(knex);
  const query = knex.table<table_attendance>("attendance");

  if (month) {
    query.whereRaw(`MONTH(check_date) = :month`, { month });
  }

  if (year) {
    query.whereRaw(`YEAR(check_date) = :year`, { year });
  }

  const items = await query.clone();

  return items.map((x) => {
    return {
      id: x.id,
      user: () => loader.load(x.user_id),
      checkIn: x.check_in
        ? moment(x.check_in).format("YYYY-MM-DD HH:mm:ss")
        : null,
      checkOut: x.check_out
        ? moment(x.check_out).format("YYYY-MM-DD HH:mm:ss")
        : null,
      overTimeIn: x.overtime_from
        ? moment(x.overtime_from).format("YYYY-MM-DD HH:mm:ss")
        : null,
      overTimeOut: x.overtime_to
        ? moment(x.overtime_to).format("YYYY-MM-DD HH:mm:ss")
        : null,
      checkDate: x.check_date
        ? moment(x.check_date).format("YYYY-MM-DD")
        : null,
      type: x.type,
      leave: x.leave_id ? () => loaderLeave.load(x.leave_id) : null,
    };
  });
}
