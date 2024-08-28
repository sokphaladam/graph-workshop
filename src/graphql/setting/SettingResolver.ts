import { ContextType } from "src/ContextType";

export const SettingResolver = {
  Query: {
    settingList: async (_, {}, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const items = await knex.table("setting");

      return items.map((x) => {
        return {
          ...x,
        };
      });
    },
  },
  Mutation: {
    updateSetting: async (_, { option, value }, ctx: ContextType) => {
      const knex = ctx.knex.default;

      await knex
        .table("setting")
        .where("option", option)
        .update("value", value);

      return true;
    },
  },
};
