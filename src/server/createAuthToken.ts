import { Knex } from "knex";
import moment from "moment";
import { table_users } from "src/generated/tables";

export async function createAuthToken(knex: Knex, token: string) {
  const user: table_users = await knex
    .table("users")
    .where("token", token)
    .first();
  if (!user) return null;
  const role = await knex.table("role_users").where("id", user.role_id).first();

  return {
    id: user.id,
    display: user.display_name,
    contact: user.contact,
    role: {
      id: role.id,
      name: role.name,
    },
    createdDate: moment(user.created_at).format("YYYY-MM-DD"),
    isActive: Boolean(user.active),
    gender: user.gender,
    ownerId: user.owner_identity,
    startingAt: user.starting_at,
    bankName: user.bank_name,
    bankAcc: user.bank_account,
    bankType: user.bank_type,
    position: user.position,
    baseSalary: user.base_salary,
    type: user.type,
    profile: user.profile,
  };
}
