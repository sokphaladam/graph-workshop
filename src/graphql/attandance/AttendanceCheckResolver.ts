import { ContextType } from "src/ContextType";
import {
  CreateActivity,
  PropsActivityInput,
} from "../users/activity/ActivityResolver";
import moment from "moment";
import { Formatter } from "src/lib/Formatter";

export async function AttendanceCheck(_, { userId, date }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const user = ctx.auth;

  if (!user) {
    return false;
  }

  const activity: PropsActivityInput = {
    userId: userId,
    type: "ATTENDANCE",
    description: "",
  };

  const todayTime = Formatter.getNowDateTime();

  const start = Number(
    user.fromTime.split(":")[0] + "." + user.fromTime.split(":")[1]
  );
  const end = Number(
    user.toTime.split(":")[0] + "." + user.toTime.split(":")[1]
  );
  const workBetween = end > start ? end - start : start - end;

  const today = moment(new Date(date))
    .subtract(workBetween, "hours")
    .format("YYYY-MM-DD");

  const query = knex
    .table("attendance")
    .where("user_id", userId)
    .orderBy("id", "desc")
    .first();

  if (start > end) {
    console.log("check overnight");
    query.whereRaw(`DATE(check_date) = DATE(:date)`, { date: today });
  }

  const item = await query.clone().select();

  if (item) {
    if (
      item.check_in &&
      item.check_out
      // &&
      // item.overtime_from &&
      // item.overtime_to
    ) {
      return false;
    }

    if (!item.check_in) {
      activity.description = `Check out`;
      await knex
        .table("attendance")
        .where({ id: item.id })
        .update({ check_in: todayTime, type: "WORK" });
    }

    if (item.check_in && !item.check_out) {
      activity.description = `Check out`;
      await knex
        .table("attendance")
        .where({ id: item.id })
        .update({ check_out: todayTime, type: "WORK" });
    }
  }
  // else {
  //   activity.description = `Check in`;
  //   await knex
  //     .table("attendance")
  //     .insert({ check_in: todayTime, user_id: userId, check_date: today });
  // }

  await CreateActivity(
    _,
    {
      data: activity,
    },
    ctx
  );

  return true;
}
