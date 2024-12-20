import { ContextType } from "src/ContextType";
import { CreateShiftResolver } from "./CreateShiftResolver";
import { UpdateShiftResolver } from "./UpdateShiftResolver";
import { table_shift } from "src/generated/tables";
import moment from "moment";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { CheckHaveOpenShiftTodayResolver } from "./ChechHaveOpenShiftTodayResolver";

export const ShiftResolver = {
  Mutation: {
    createShift: CreateShiftResolver,
    updateShift: UpdateShiftResolver,
  },
  Query: {
    checkHaveOpenShiftToday: CheckHaveOpenShiftTodayResolver,
    shiftList: async (
      _,
      { limit, offset, users, fromDate, toDate },
      ctx: ContextType
    ) => {
      const knex = ctx.knex.default;
      const user = ctx.auth;
      const loader = createUserByIdLoader(knex);
      const query = knex.table("shift");

      if (![1, 2, 5].includes(user.role.id || 0)) {
        if (users) {
          query.whereIn("user_id", users);
        }
      }

      if (fromDate && toDate) {
        query.whereBetween("open", [fromDate, toDate]);
      }

      const items: table_shift[] = await query
        .clone()
        .limit(limit)
        .offset(offset)
        .orderBy("id", "desc");

      return items.map((x) => {
        return {
          id: x.id,
          open: x.open ? moment(x.open).format("YYYY-MM-DD HH:mm:ss") : null,
          openCurrency: {
            usd: x.open_usd,
            khr: x.open_khr,
          },
          close: x.close ? moment(x.close).format("YYYY-MM-DD HH:mm:ss") : null,
          closeCurrency: {
            usd: x.close_usd,
            khr: x.close_khr,
          },
          expectedCurrency: {
            usd: x.expect_usd,
            khr: x.expect_khr,
          },
          deposit: x.deposit,
          note: x.note,
          bank: JSON.parse(x.bank),
          bill: x.bill,
          card: x.card,
          user: () => loader.load(x.user_id),
          customer: x.customer || 0,
          customerAvgCost: x.customer_cost_avg || 0,
        };
      });
    },
    shiftById: async (_, { id, date, userId }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loader = createUserByIdLoader(knex);
      const query = knex.table("shift");

      if (id) {
        query.where({ id });
      }

      if (date) {
        query.whereRaw(`DATE(open) = Date(:date)`, { date });
      }

      if (userId) {
        query.where({ user_id: userId });
      }

      const item = await query.clone().first();

      if (!item) {
        return null;
      }

      return {
        id: item.id,
        open: item.open
          ? moment(item.open).format("YYYY-MM-DD HH:mm:ss")
          : null,
        openCurrency: {
          usd: item.open_usd,
          khr: item.open_khr,
        },
        close: item.close
          ? moment(item.close).format("YYYY-MM-DD HH:mm:ss")
          : null,
        closeCurrency: {
          usd: item.close_usd,
          khr: item.close_khr,
        },
        expectedCurrency: {
          usd: item.expect_usd,
          khr: item.expect_khr,
        },
        deposit: item.deposit,
        note: item.note,
        bank: JSON.parse(item.bank),
        bill: item.bill,
        card: item.card,
        user: () => loader.load(item.user_id),
        customer: item.customer || 0,
        customerAvgCost: item.customer_cost_avg || 0,
      };
    },
  },
};
