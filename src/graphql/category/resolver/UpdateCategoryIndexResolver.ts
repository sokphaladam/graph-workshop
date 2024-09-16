import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";

export async function UpdateCategoryIndexResolver(
  _,
  { data }: { data: Graph.CategoryIndexInput[] },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.transaction(async (tx) => {
    const query = data.map((item) => {
      return tx
        .table("category")
        .where({ id: item.id })
        .update({ index: item.index })
        .transacting(tx);
    });

    try {
      await Promise.all(query);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  });

  return true;
}
