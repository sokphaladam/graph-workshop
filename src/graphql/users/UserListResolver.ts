import moment from "moment";
import { ContextType } from "src/ContextType";
import { createDataLoader } from "src/dataloader";
import { Graph } from "src/generated/graph";
import { table_role_users, table_users } from "src/generated/tables";

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

  const users: table_users[] = await query
    .offset(offset)
    .limit(limit)
    .where("active", true);

  return users.map((x) => ({
    id: x.id,
    display: x.display_name,
    contact: x.contact,
    role: () => loader.roleLoader.load(x.role_id) as any,
    createdDate: moment(x.created_at).format("YYYY-MM-DD"),
    isActive: Boolean(x.active),
    gender: x.gender,
  }));
}
