import { Knex } from "knex";
import Dataloader from "dataloader";
import { table_addon_products, table_user_leave } from "src/generated/tables";
import moment from "moment";
import { Formatter } from "src/lib/Formatter";
import { createUserByIdLoader } from "./UserLoader";

export function createLeaveByIdDateLoader(knex: Knex) {
  const loaderUser = createUserByIdLoader(knex);
  return new Dataloader(async (keys: string[]) => {
    const items = await knex.table("user_leave").whereIn("id", keys);

    return keys.map((x) => {
      const find = items.find((f) => f.id === x);

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        startDate: find.leave_from ? Formatter.dateTime(find.leave_from) : null,
        endDate: find.leave_to ? Formatter.dateTime(find.leave_to) : null,
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
