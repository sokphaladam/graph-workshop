import { ContextType } from "src/ContextType";

export async function PeopleInOrderResolver(
  _,
  { id, count },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.table("orders").where({ id }).update({ person: count });

  return true;
}
