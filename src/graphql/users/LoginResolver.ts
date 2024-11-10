import { GraphQLError } from "graphql";
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

  if (login && !!login.is_reset_password) {
    throw new GraphQLError("Your password was reset change new password!", {
      extensions: { code: "RESET_PASSWORD" },
    });
  }

  return login ? login.token : null;
}

export async function ResetPasswordResolver(
  _,
  { username, oldPassowrd, password },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const login: table_users = await knex
    .table("users")
    .whereRaw("username=:username AND password=md5(:password) AND active = 1", {
      username,
      password: oldPassowrd,
    })
    .first();

  if (login) {
    const pwd = (
      await knex.select(knex.raw(`md5(:pwd) as pwd`, { pwd: password })).first()
    ).pwd;

    console.log(pwd);

    await knex
      .table("users")
      .where({ id: login.id })
      .update({ password: pwd, is_reset_password: false });

    return true;
  }

  return false;
}
