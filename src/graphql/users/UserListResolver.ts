import moment from "moment";
import { ContextType } from "src/ContextType";
import { createDataLoader } from "src/dataloader";
import { createRoleByIdLoader } from "src/dataloader/RoleLoader";
import { table_users } from "src/generated/tables";

export async function UserListResolver(
  _,
  { offset, limit, roles, position, search },
  ctx: ContextType
): Promise<any[]> {
  const knex = ctx.knex.default;
  const loader = createRoleByIdLoader(knex);

  const query = knex.table<table_users>("users");

  if (search) {
    const users = await query
      .clone()
      .whereRaw("display_name LIKE :search OR contact LIKE :search", {
        search: "%" + search + "%",
      })
      .offset(offset)
      .limit(limit);

    return users.map((x) => ({
      id: x.id,
      display: x.display_name,
      contact: x.contact,
      role: () => loader.load(x.role_id) as any,
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

  if (roles) {
    query.whereIn("role_id", roles);
  }

  if (position) {
    query.whereIn("position", position);
  }

  const users: table_users[] = await query.offset(offset).limit(limit);

  return users.map((x) => ({
    id: x.id,
    display: x.display_name,
    contact: x.contact,
    role: () => loader.load(x.role_id) as any,
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
    fromTime: x.from_time,
    toTime: x.to_time,

    username: x.username,
    password: x.password,
  }));
}
