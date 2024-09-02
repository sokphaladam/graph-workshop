import { ContextType } from "src/ContextType";
import { UserListResolver } from "./UserListResolver";
import { createDataLoader } from "src/dataloader";
import moment from "moment";
import { LoginResolver } from "./LoginResolver";
import { CreateUserResolver } from "./CreateUserResolver";
import { UpdateUserResolver } from "./UpdateUserResolver";
import { table_users } from "src/generated/tables";

export const UserResolver = {
  Gender: {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
  },
  Mutation: {
    login: LoginResolver,
    createUser: CreateUserResolver,
    updateUser: UpdateUserResolver,
  },
  Query: {
    userList: UserListResolver,
    user: async (_, { id }, ctx: ContextType) => {
      const knex = ctx.knex.default;
      const loader = createDataLoader(knex);

      const user: table_users = await knex
        .table("users")
        .where("id", id)
        .first();

      return {
        id: user.id,
        display: user.display_name,
        contact: user.contact,
        role: () => loader.roleLoader.load(user.role_id) as any,
        createdDate: moment(user.created_at).format("YYYY-MM-DD"),
        isActive: Boolean(user.active),
        gender: user.gender,
        dob: moment(user.dob).format("YYYY-MM-DD"),
        owerId: user.owner_identity,
        startingAt: moment(user.starting_at).format("YYYY-MM-DD"),
        bankName: user.bank_name,
        bankAcc: user.bank_account,
        bankType: user.bank_type,
        position: user.position,
        baseSalary: user.base_salary,
        type: user.type,
        profile: user.profile,
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
