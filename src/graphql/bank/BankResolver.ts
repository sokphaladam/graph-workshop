import moment from "moment";
import { ContextType } from "src/ContextType";

export const BankResolver = {
  Query: {
    getbankList: async (_, { offset, limit }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      const items = await knex.table("bank_info").offset(offset).limit(limit);

      return items.map((x) => {
        return {
          id: x.id,
          name: x.name,
          phone: x.phone_number,
          createdDate: moment(new Date(x.created_at)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          updatedDate: moment(new Date(x.updated_at)).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        };
      });
    },
    bankInfo: async (_, { id }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const item = await knex.table("bank_info").first().where({ id });

      return {
        id: item.id,
        name: item.name,
        phone: item.phone_number,
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
    createBank: async (_, { name, phone }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex.table("bank_info").insert({ name, phone_number: phone });
      return true;
    },
    updateBank: async (_, { id, name, phone }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex
        .table("bank_info")
        .update({
          name,
          phone_number: phone,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
        .where({ id });
      return true;
    },
  },
};
