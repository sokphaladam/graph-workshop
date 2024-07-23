import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_category } from "src/generated/tables";

export async function createCategory(
  _,
  { data }: { data: Graph.CategoryInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const create = await knex.table<table_category>("category").insert({
    name: data.name,
    root: data.root,
  });

  return create[0] > 0;
}
