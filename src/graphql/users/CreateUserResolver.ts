import { randomBytes } from "crypto";
import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_users } from "src/generated/tables";

function getToken() {
  return randomBytes(48).toString("hex");
}

export async function CreateUserResolver(
  _,
  { data }: { data: Graph.UserInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const pwd = (
    await knex
      .select(knex.raw(`md5(:pwd) as pwd`, { pwd: data.password }))
      .first()
  ).pwd;

  const input: table_users = {
    role_id: data.roleId,
    display_name: data.display,
    username: data.username,
    password: pwd,
    token: `DU${getToken()}`,
    gender: data.gender as any,
    contact: data.contact,
    owner_identity: data.ownerId,
    created_at: data.createdDate,
    dob: data.dob,
    starting_at: data.startingAt,
    bank_name: data.bankName,
    bank_account: data.bankAcc,
    bank_type: data.bankType,
    profile: data.profile,
    position: data.position,
    base_salary: data.baseSalary,
    type: "STAFF",
    active: data.isActive as any,
  };

  await knex.table("users").insert(input);

  return true;
}
