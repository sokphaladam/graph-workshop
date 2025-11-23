import { ContextType } from "src/ContextType";
import { createOrderByIDLoader } from "src/dataloader/OrderLoader";
import { SwapOrderTableResolver } from "./SwapOrderTableResolver";

export const TableSetResolver = {
  Query: {
    tableSetList: async (_, { limit, offset }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loaderOrder = createOrderByIDLoader(knex);

      const item = await knex.table("table_set").limit(limit).offset(offset);

      const fakeSet = [...new Array(10)].map((_, i) => {
        return {
          set: i + 1 + item.length,
          fake: true,
        };
      });

      const orders = await knex
        .table("orders")
        .whereIn(
          "set",
          [...item, ...fakeSet].map((x) => String(x.set))
        )
        .whereIn("status", ["0", "1", "2"])
        .select(["id", "set"]);

      return [...item, ...fakeSet].map((x) => {
        const find = orders.find((f) => String(f.set) === String(x.set));
        return {
          set: x.set,
          fake: x.fake ? true : false,
          order: find ? () => loaderOrder.load(find.id) : null,
          floor: x.floor ? x.floor : "Ground Floor",
        };
      });
    },
    tableSet: async (_, { id }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loaderOrder = createOrderByIDLoader(knex);

      const item = await knex.table("table_set").where("set", id).first();
      const order = await knex
        .table("orders")
        .where("set", String(item.set))
        .whereIn("status", ["0", "1", "2"])
        .select(["id", "set"])
        .first();

      return {
        set: item.set,
        order: order ? () => loaderOrder.load(order.id) : null,
      };
    },
  },
  Mutation: {
    generateTableSet: async (_, { sets }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      const items = [...new Array(sets)].map((_, i) => ({ set: i + 1 }));

      if (items.length > 0) {
        await knex.table("table_set").del().whereNot("created_at", null);
        await knex.table("table_set").insert(items);
      }

      return true;
    },
    swapOrderTable: SwapOrderTableResolver,
    configureTableSet: async (_, { data }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex.transaction(async (trx) => {
        for (const item of data) {
          const sets = Array.from(
            { length: item.rangeEnd - item.rangeStart + 1 },
            (_, i) => i + item.rangeStart
          );
          await trx.table("table_set").whereIn("set", sets).update({
            floor: item.floor,
          });
        }
      });

      return true;
    },
  },
};
