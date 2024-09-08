import moment from "moment";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { ContextType } from "src/ContextType";

export const AttendanceResolver = {
  Query: {
    getAttendanceStaff: async (
      _,
      { from, to, limit, offset },
      ctx: ContextType
    ) => {
      const knex = ctx.knex.default;
      const user = ctx.auth;

      if (!user) {
        return null;
      }

      const query = knex.table("attendance").where({ user_id: user.id });

      if (from && to) {
        query.whereRaw(`DATE(check_date) BETWEEN :from AND :to`, { from, to });
      }

      const items = await query
        .clone()
        .limit(limit)
        .offset(offset)
        .orderBy("check_date", "asc");

      return items.map((x) => {
        return {
          id: x.id,
          user: user,
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
        };
      });
    },
    getAttendanceStaffToday: async (_, { date }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const user = ctx.auth;

      if (!user) {
        return null;
      }

      const today = moment(new Date(date)).format("YYYY-MM-DD");
      const items = await knex
        .table("attendance")
        .where({ user_id: user.id, check_date: today })
        .first();

      if (!items) {
        return null;
      }

      return {
        id: items.id,
        user: user,
        checkIn: items.check_in
          ? moment(items.check_in).format("YYYY-MM-DD HH:mm:ss")
          : null,
        checkOut: items.check_out
          ? moment(items.check_out).format("YYYY-MM-DD HH:mm:ss")
          : null,
        overTimeIn: items.overtime_from
          ? moment(items.overtime_from).format("YYYY-MM-DD HH:mm:ss")
          : null,
        overTimeOut: items.overtime_to
          ? moment(items.overtime_to).format("YYYY-MM-DD HH:mm:ss")
          : null,
        checkDate: items.check_date
          ? moment(items.check_date).format("YYYY-MM-DD")
          : null,
      };
    },
  },
  Mutation: {
    checkAttendance: async (_, { userId, date }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      const today = moment(new Date(date)).format("YYYY-MM-DD");
      const todayTime = moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss");

      const item = await knex
        .table("attendance")
        .where("user_id", userId)
        .whereRaw(`DATE(check_date) = DATE(:date)`, { date: today })
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
          .insert({ check_in: todayTime, user_id: userId, check_date: today });
      }

      return true;
    },
  },
};