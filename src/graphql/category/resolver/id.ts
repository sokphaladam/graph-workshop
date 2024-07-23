import { ContextType } from "src/ContextType";

export async function category(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("category")
    .where({ id: id, is_active: true })
    .first();

  return item;
}
