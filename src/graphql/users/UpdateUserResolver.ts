import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";

export async function UpdateUserResolver(
  _,
  { id, data }: { id: number; data: Graph.UserInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input = {
    role_id: data.roleId,
    display_name: data.display,
    gender: data.gender,
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
  };

  await knex.table("users").where({ id }).update(input);

  return true;
}
