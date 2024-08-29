import { ContextType } from "src/ContextType";

export async function DeliveryListResolver(
  _,
  { offset, limit },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const items = await knex.table("delivery").limit(limit).offset(offset);

  return items.map((x) => {
    return {
      id: x.id,
      name: x.name,
      contact: x.contact,
    };
  });
}

export async function DeliveryIDResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const item = await knex.table("delivery").where("id", id).first();

  return {
    id: item.id,
    name: item.name,
    contact: item.contact,
  };
}
