import { ContextType } from "src/ContextType";

export async function UpdateStatusProducResolver(
  _,
  { id, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("products").where({ id }).update({ status });

  return true;
}
