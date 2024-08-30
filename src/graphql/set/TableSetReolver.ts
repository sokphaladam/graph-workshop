import { ContextType } from "src/ContextType";
import { createOrderByIDLoader } from "src/dataloader/OrderLoader";

export const TableSetResolver = {
  Query: {
    tableSetList: async (_, { limit, offset }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loaderOrder = createOrderByIDLoader(knex);

      const item = await knex.table("table_set").limit(limit).offset(offset);
      const orders = await knex
        .table("orders")
        .whereIn(
          "set",
          item.map((x) => String(x.set))
        )
        .whereIn("status", ["0", "1", "2"])
        .select(["id", "set"]);

      return item.map((x) => {
        const find = orders.find((f) => String(f.set) === String(x.set));
        return {
          set: x.set,
          order: find ? () => loaderOrder.load(find.id) : null,
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
        await knex.table("table_set").del();
        await knex.table("table_set").insert(items);
      }

      return true;
    },
  },
};
