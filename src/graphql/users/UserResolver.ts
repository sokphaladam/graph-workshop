import { ContextType } from "src/ContextType";
import { UserListResolver } from "./UserListResolver";
import { createDataLoader } from "src/dataloader";
import moment from "moment";
import { LoginResolver } from "./LoginResolver";

export const UserResolver = {
  Gender: {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
  },
  Mutation: {
    login: LoginResolver,
  },
  Query: {
    userList: UserListResolver,
    user: async (_, { id }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loader = createDataLoader(knex);

      const user = await knex.table("users").where("id", id).first();

      return {
        id: user.id,
        display: user.display_name,
        contact: user.contact,
        role: () => loader.roleLoader.load(user.role_id) as any,
        createdDate: moment(user.created_at).format("YYYY-MM-DD"),
        isActive: Boolean(user.active),
        gender: user.gender,
      };
    },
    me: (_, {}, ctx: ContextType) => {
      if (!ctx.auth) {
        return null;
      }
      return ctx.auth || null;
    },
  },
};
