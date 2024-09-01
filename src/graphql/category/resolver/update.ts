import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_category } from "src/generated/tables";

export async function updateCategory(
  _,
  {
    id,
    data,
    isActive,
  }: { id: number; data: Graph.CategoryInput; isActive: boolean },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  if (id === data.root) {
    return false;
  }

  const update = await knex
    .table<table_category>("category")
    .where({ id })
    .update(
      isActive !== undefined
        ? {
            name: data.name,
            root: data.root,
            is_active: isActive,
          }
        : {
            name: data.name,
            root: data.root,
          }
    );

  return update > 0;
}
