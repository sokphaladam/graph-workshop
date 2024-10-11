import { ContextType } from "src/ContextType";

export async function CheckProductCodeResolver(_, { code }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex.table("products").where({ code }).first();

  if (item) {
    return false;
  }

  return true;
}
