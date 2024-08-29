import { ContextType } from "src/ContextType";

export async function CreateDeliveryResolver(_, { data }, ctx: ContextType) {
  const knex = ctx.knex.default;

  await knex.table("delivery").insert({
    name: data.name,
    contact: data.contact,
  });

  return true;
}

export async function UpdateDeliveryResolver(
  _,
  { id, data },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex
    .table("delivery")
    .update({
      name: data.name,
      contact: data.contact,
    })
    .where("id", id);

  return true;
}
