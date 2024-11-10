import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_users } from "src/generated/tables";

export async function UpdateUserResolver(
  _,
  { id, data }: { id: number; data: Graph.UserInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input: table_users = {
    role_id: data.roleId,
    display_name: data.display,
    gender: data.gender as any,
    contact: data.contact,
    owner_identity: data.ownerId,
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
    username: data.username,
    from_time: data.fromTime as any,
    to_time: data.toTime as any,
  };

  if (data.password) {
    const pwd = (
      await knex
        .select(knex.raw(`md5(:pwd) as pwd`, { pwd: data.password }))
        .first()
    ).pwd;

    input.password = pwd;
    (input as any).is_reset_password = true;
  }

  await knex.table("users").where({ id }).update(input);

  return true;
}
