import moment from "moment";
import { ContextType } from "src/ContextType";
import { createDataLoader } from "src/dataloader";
import { table_users } from "src/generated/tables";

export async function UserListResolver(
  _,
  { offset, limit, roles },
  ctx: ContextType
): Promise<any[]> {
  const knex = ctx.knex.default;
  const loader = createDataLoader(knex);

  const query = knex.table<table_users>("users");

  if (roles) {
    query.whereIn("role_id", roles);
  }

  const users: table_users[] = await query.offset(offset).limit(limit);

  return users.map((x) => ({
    id: x.id,
    display: x.display_name,
    contact: x.contact,
    role: () => loader.roleLoader.load(x.role_id) as any,
    createdDate: moment(x.created_at).format("YYYY-MM-DD"),
    isActive: Boolean(x.active),
    gender: x.gender,
    dob: moment(x.dob).format("YYYY-MM-DD"),
    ownerId: x.owner_identity,
    startingAt: moment(x.starting_at).format("YYYY-MM-DD"),
    bankName: x.bank_name,
    bankAcc: x.bank_account,
    bankType: x.bank_type,
    position: x.position,
    baseSalary: x.base_salary,
    type: x.type,
    profile: x.profile,

    username: x.username,
    password: x.password,
  }));
}
