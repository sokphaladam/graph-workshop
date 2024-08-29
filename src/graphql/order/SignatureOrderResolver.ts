import moment from "moment";
import { ContextType } from "src/ContextType";
import { table_orders, table_users } from "src/generated/tables";

export async function SignatureOrderResolver(
  _,
  { id, username, password },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const user: table_users = await knex
    .table("users")
    .whereRaw("username=:username AND password=md5(:password) AND active = 1", {
      username,
      password,
    })
    .first();

  if (user) {
    await knex
      .table<table_orders>("orders")
      .where({
        id,
        signature_by: null,
      })
      .update({
        signature_by: user.id,
        signature_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      });

    return true;
  }

  return false;
}
