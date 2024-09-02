import moment from "moment";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { ContextType } from "src/ContextType";

export const AttendanceResolver = {
  Query: {
    getAttendanceStaff: async (_, { from, to }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const user = ctx.auth;

      if (!user) {
        return null;
      }

      const items = await knex.table("attendance").where({ user_id: user.id });

      return items;
    },
  },
  Mutation: {
    checkAttendance: async (_, { userId, date }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      const today = moment(new Date(date)).format("YYYY-MM-DD");
      const todayTime = moment(new Date(date)).format("HH:mm:ss");

      const item = await knex
        .table("attendance")
        .whereRaw(`DATE(created_at) = DATE(:date)`, { date: today })
        .first();

      if (item) {
        if (
          item.check_in &&
          item.check_out &&
          item.overtime_from &&
          item.overtime_to
        ) {
          return false;
        }

        if (item.check_out) {
          if (item.overtime_from) {
            await knex
              .table("attendance")
              .where({ id: item.id })
              .update({ overtime_to: todayTime });
          } else {
            await knex
              .table("attendance")
              .where({ id: item.id })
              .update({ overtime_from: todayTime });
          }
        } else {
          await knex
            .table("attendance")
            .where({ id: item.id })
            .update({ check_out: todayTime });
        }
      } else {
        await knex
          .table("attendance")
          .insert({ check_in: todayTime, user_id: userId });
      }

      return true;
    },
  },
};
