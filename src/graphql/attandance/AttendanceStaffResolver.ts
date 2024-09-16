import { ContextType } from "src/ContextType";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { table_attendance } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export async function AttendanceStaffResolver(
  _,
  { userId, from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const userLoader = createUserByIdLoader(knex);

  const items: table_attendance[] = await knex
    .table<table_attendance>("attendance")
    .where("user_id", "=", userId)
    .whereRaw("DATE(check_date) BETWEEN :from AND :to", { from, to });

  return items.map((item) => {
    return {
      id: item.id,
      user: () => userLoader.load(item.user_id),
      checkIn: item.check_in ? Formatter.dateTime(item.check_in) : null,
      checkOut: item.check_out ? Formatter.dateTime(item.check_out) : null,
      checkDate: item.check_date ? Formatter.dateTime(item.check_date) : null,
    };
  });
}
