import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_brand } from "src/generated/tables";

export async function BrandListResolver(
  _,
  { offset, limit },
  ctx: ContextType
): Promise<Graph.Brand[]> {
  const knex = ctx.knex.default;

  const items: table_brand[] = await knex
    .table<table_brand>("brand")
    .where("is_active", true)
    .offset(offset)
    .limit(limit);

  return items.map((x) => ({
    id: Number(x.id),
    name: x.name,
    logo: x.logo,
  }));
}
