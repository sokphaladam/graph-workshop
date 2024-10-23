import moment from "moment";
import { ContextType } from "src/ContextType";

export async function ReportStaffPayrollResolver(
  _,
  { from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const query = knex.table("attendance").whereBetween("check_date", [from, to]);

  const attendance = await query.clone().select();
  const users = await knex
    .table("users")
    .whereIn(
      "id",
      attendance.map((x) => x.user_id)
    )
    .where({ active: true, type: "STAFF" });

  return users.map((x) => {
    const list = attendance.filter((f) => f.user_id === x.id);
    const absent = list.filter((f) => f.type === "ABSENT").length;
    const salaryDay = (Number(x.base_salary) / 30).toFixed(2);
    const duration = moment(
      moment(new Date()).format("YYYY-MM-DD") + " " + x.to_time
    ).diff(
      moment(moment(new Date()).format("YYYY-MM-DD") + " " + x.from_time),
      "hours"
    );
    const salaryHour = Number(salaryDay) / duration;
    const checkInLate = list
      .filter(
        (f) =>
          f.type === "WORK" &&
          moment(
            moment(f.check_date).format("YYYY-MM-DD") + " " + x.from_time
          ).isBefore(f.check_in) &&
          f.leave_id === null
      )
      .reduce(
        (a, b) =>
          (a =
            a +
            moment(b.check_in).diff(
              moment(b.check_date).format("YYYY-MM-DD") + " " + x.from_time,
              "minutes"
            )),
        0
      );
    const checkOutEarly = list
      .filter(
        (f) =>
          f.type === "WORK" &&
          moment(
            moment(f.check_date).format("YYYY-MM-DD") + " " + x.to_time
          ).isAfter(f.check_out) &&
          f.leave_id === null
      )
      .reduce(
        (a, b) =>
          (a =
            a +
            moment(
              moment(b.check_date).format("YYYY-MM-DD") + " " + x.to_time
            ).diff(b.check_out, "minutes")),
        0
      );
    const ot = list
      .filter((f) => !!f.overtime_from && !!f.overtime_to)
      .reduce((a, b) => {
        return {
          duration:
            (a.duration || 0) +
            moment(b.overtime_to).diff(b.overtime_from, "hours"),
          pay:
            (a.pay || 0) +
            moment(b.overtime_to).diff(b.overtime_from, "hours") *
              salaryHour *
              b.ot_extra,
        };
      }, {});

    const holiday = list
      .filter((f) => f.holiday_extra > 1 && f.type === "WORK")
      .reduce((a, b) => (a = a + Number(salaryDay) * (b.holiday_extra - 1)), 0);

    const totalWorkDays = list.length;

    const checkOutEmpty = list.filter(
      (f) => f.type === "WORK" && !f.check_out && f.leave_id === null
    ).length;

    return {
      user: {
        id: x.id,
        name: x.display_name,
        position: x.position,
        salary: x.base_salary,
        salaryDay,
        salaryHour: salaryHour.toFixed(2),
        work: {
          from: x.from_time,
          to: x.to_time,
          duration,
        },
        profile: x.profile,
      },
      absent,
      absentPay: (absent * Number(salaryDay)).toFixed(2),
      checkInLate: (checkInLate / 60).toFixed(2),
      checkInLatePay: ((checkInLate / 60) * Number(salaryHour)).toFixed(2),
      checkOutEarly: (checkOutEarly / 60).toFixed(2),
      checkOutEarlyPay: ((checkOutEarly / 60) * Number(salaryHour)).toFixed(2),
      checkOutEmpty,
      checkOutEmptyPay: (0.5 * checkOutEmpty * Number(salaryHour)).toFixed(2),
      ot: {
        duration: ot.duration || 0,
        pay: Number(ot.pay || 0).toFixed(2),
      },
      holiday,
      totalWorkDays,
    };
  });
}
