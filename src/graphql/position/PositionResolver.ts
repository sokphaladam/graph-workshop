import moment from "moment";
import { ContextType } from "src/ContextType";

export const PositionResolver = {
  Query: {
    getPositionList: async (_, { offset, limit }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      const items = await knex
        .table("user_position")
        .offset(offset)
        .limit(limit);

      return items.map((x) => {
        return {
          id: x.id,
          name: x.name,
          createdDate: moment(new Date(x.created_at)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          updatedDate: moment(new Date(x.updated_at)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        };
      });
    },
    position: async (_, { id }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const item = await knex.table("user_position").first().where({ id });

      return {
        id: item.id,
        name: item.name,
        createdDate: moment(new Date(item.created_at)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        updatedDate: moment(new Date(item.updated_at)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };
    },
  },
  Mutation: {
    createPosition: async (_, { name }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex.table("user_position").insert({ name });
      return true;
    },
    updatePosition: async (_, { id, name }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex
        .table("user_position")
        .update({
          name,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
        .where({ id });
      return true;
    },
  },
};
