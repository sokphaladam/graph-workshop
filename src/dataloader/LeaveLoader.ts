import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_addon_products, table_user_leave } from "src/generated/tables";
import moment from "moment";
import { Formatter } from "src/lib/Formatter";
import { createUserByIdLoader } from "./UserLoader";

export function createLeaveByDateLoader(knex: Knex) {
  const loaderUser = createUserByIdLoader(knex);
  return new Dataloader(async (keys: string[]) => {
    console.log(keys);
    // const items: table_user_leave[] = await knex
    //   .table("user_leave")
    //   .whereIn(knex.raw("DATE(request_date)") as any, keys)
    //   .where({ status: "APPROVED" });

    const items = await knex.raw(
      `
      SELECT * 
      FROM user_leave 
      WHERE DATE(request_date) IN (:date)`,
      { date: keys }
    );

    console.log(items);

    return keys.map((x) => {
      const find = items[0].find(
        (f) => moment(f.request_date).diff(moment(x), "day") === 0
      );

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        startDate: Formatter.dateTime(find.leave_from),
        endDate: Formatter.dateTime(find.leave_to),
        leaveType: find.type,
        leaveReason: find.leave_reason,
        duration: find.duration,
        status: find.status,
        approvedDate: find.approved_date
          ? Formatter.dateTime(find.approved_date)
          : null,
        approvedBy: find.approved_by
          ? () => loaderUser.load(find.approved_by)
          : null,
        requestedBy: find.request_by
          ? () => loaderUser.load(find.request_by)
          : null,
        requestedDate: find.request_date
          ? Formatter.dateTime(find.request_date)
          : null,
        rejectedBy: find.rejected_by
          ? () => loaderUser.load(find.rejected_by)
          : null,
        rejectedDate: find.rejected_date
          ? Formatter.dateTime(find.rejected_date)
          : null,
        cancelledDate: find.cancelled_date
          ? Formatter.dateTime(find.cancelled_date)
          : null,
        cancelledBy: find.cancelled_by
          ? () => loaderUser.load(find.cancelled_by)
          : null,
      };
    });
  });
}
