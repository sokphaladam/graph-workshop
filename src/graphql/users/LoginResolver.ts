import { ContextType } from "src/ContextType";
import { table_users } from "src/generated/tables";

export async function LoginResolver(
  _,
  { username, password },
  ctx: ContextType
): Promise<string> {
  const knex = ctx.knex.default;

  const login: table_users = await knex
    .table("users")
    .whereRaw("username=:username AND password=md5(:password) AND active = 1", {
      username,
      password,
    })
    .first();

  return login ? login.token : null;
}
