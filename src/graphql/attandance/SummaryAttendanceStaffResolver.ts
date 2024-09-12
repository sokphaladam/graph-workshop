import moment from "moment";
import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function SummaryAttendanceStaffResolver(
  _,
  { userId },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const now = "2024-09-12";

  const month = moment(now).month() + 1;
  const year = moment(now).year();

  const attendance = await knex
    .table("attendance")
    .where({ user_id: userId })
    .whereRaw("MONTH(check_date) = :month AND YEAR(check_date) = :year", {
      month,
      year,
    });
  const ot = await knex
    .table("staff_overtime")
    .whereRaw("MONTH(ot_date) = :month AND YEAR(ot_date) = :year", {
      month,
      year,
    })
    .where({ user_id: userId })
    .select("id");

  const today = attendance.filter((f) => {
    const fd = moment(f.check_date).date();
    const cd = moment(now).date();
    return fd === cd;
  });

  const week = attendance.filter((f) => {
    const cd = moment(now);
    return cd.isBetween(
      moment(now).startOf("week"),
      moment(now).endOf("week"),
      null,
      "[]"
    );
  });

  const attmonth = attendance.filter((f) => {
    const fd = moment(f.check_date).month();
    return month === fd + 1;
  });

  return {
    today:
      today.length > 0
        ? today.reduce((a, b) => {
            const checkIn = moment(b.check_in);
            const checkOut = moment(b.check_out);
            const diff = checkOut.diff(checkIn, "hour");
            return (a = a + diff);
          }, 0)
        : 0,
    week:
      week.length > 0
        ? week.reduce((a, b) => {
            const checkIn = moment(b.check_in);
            const checkOut = moment(b.check_out);
            const diff = checkOut.diff(checkIn, "hour");
            return (a = a + diff);
          }, 0)
        : 0,
    month:
      attmonth.length > 0
        ? attmonth.reduce((a, b) => {
            const checkIn = moment(b.check_in);
            const checkOut = moment(b.check_out);
            const diff = checkOut.diff(checkIn, "hour");
            return (a = a + diff);
          }, 0)
        : 0,
    ot: ot.length,
  };
}
