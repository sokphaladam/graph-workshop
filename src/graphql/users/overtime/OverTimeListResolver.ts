import moment from "moment";
import { ContextType } from "src/ContextType";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { table_staff_overtime, table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export async function OverTimeListResolver(
  _,
  { limit, offset, status, from, end },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const user = ctx.auth;
  const loaderUser = createUserByIdLoader(knex);

  const query = knex.table("staff_overtime");

  if (status && status.length > 0) {
    query.whereIn("status", status);
  }

  if (from && end) {
    query.whereBetween("request_date", [from, end]);
  }

  if (user) {
    if (![1, 2, 6].includes(user.role.id)) {
      query.where("request_by", user.id);
    }
  }

  const items: table_staff_overtime[] = await query
    .clone()
    .limit(limit)
    .offset(offset)
    .orderBy("created_at", "desc");

  return items.map((item) => {
    return {
      id: item.id,
      startat: item.ot_from,
      endAt: item.ot_to,
      otDate: Formatter.date(item.ot_date),
      note: item.note,
      status: item.status,
      approvedDate: item.approved_date
        ? Formatter.dateTime(item.approved_date)
        : null,
      approvedBy: item.approved_by
        ? () => loaderUser.load(item.approved_by)
        : null,
      requestedBy: item.request_by
        ? () => loaderUser.load(item.request_by)
        : null,
      requestedDate: item.request_date
        ? Formatter.dateTime(item.request_date)
        : null,
      rejectedBy: item.rejected_by
        ? () => loaderUser.load(item.rejected_by)
        : null,
      rejectedDate: item.rejected_date
        ? Formatter.dateTime(item.rejected_date)
        : null,
      cancelledDate: item.cancelled_date
        ? Formatter.dateTime(item.cancelled_date)
        : null,
      cancelledBy: item.cancelled_by
        ? () => loaderUser.load(item.cancelled_by)
        : null,
    };
  });
}

export async function OverTimeById(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loaderUser = createUserByIdLoader(knex);

  const item: table_staff_overtime = await knex
    .table("user_lstaff_overtimeeave")
    .where({ id })
    .first();

  return {
    id: item.id,
    startat: item.ot_from,
    endAt: item.ot_to,
    otDate: Formatter.date(item.ot_date),
    note: item.note,
    status: item.status,
    approvedDate: item.approved_date
      ? Formatter.dateTime(item.approved_date)
      : null,
    approvedBy: item.approved_by
      ? () => loaderUser.load(item.approved_by)
      : null,
    requestedBy: item.request_by
      ? () => loaderUser.load(item.request_by)
      : null,
    requestedDate: item.request_date
      ? Formatter.dateTime(item.request_date)
      : null,
    rejectedBy: item.rejected_by
      ? () => loaderUser.load(item.rejected_by)
      : null,
    rejectedDate: item.rejected_date
      ? Formatter.dateTime(item.rejected_date)
      : null,
    cancelledDate: item.cancelled_date
      ? Formatter.dateTime(item.cancelled_date)
      : null,
    cancelledBy: item.cancelled_by
      ? () => loaderUser.load(item.cancelled_by)
      : null,
  };
}
