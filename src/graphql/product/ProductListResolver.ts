import { ContextType } from "src/ContextType";
import { createCategoryLoader } from "src/dataloader/CategoryLoader";
import { createSkuByProductIDLoader } from "src/dataloader/SkuLoader";
import { Graph } from "src/generated/graph";
import { table_products } from "src/generated/tables";

export async function ProductListResolver(
  _,
  { offset, limit, code, filter },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const categoryLoader = createCategoryLoader(knex);
  const skuLoader = createSkuByProductIDLoader(knex);

  const queries = knex
    .table<table_products>("products")
    .where("is_active", true);

  if (code) {
    const item = await queries
      .clone()
      .offset(offset)
      .limit(limit)
      .whereRaw("code LIKE :code", { code: "%" + code + "%" });

    return item.map((x) => {
      return {
        id: x.id,
        code: x.code,
        category: () => categoryLoader.load(x.category_id),
        description: x.description,
        images: x.images,
        sku: () => skuLoader.load(x.id),
        title: x.title,
        type: x.type.split(","),
      };
    });
  }

  if (filter) {
    if (filter.category) {
      queries.whereIn("category_id", filter.category);
    }
  }

  const items: table_products[] = await queries
    .clone()
    .offset(offset)
    .limit(limit);

  return items.map((x) => {
    return {
      id: x.id,
      code: x.code,
      category: () => categoryLoader.load(x.category_id),
      description: x.description,
      images: x.images,
      sku: () => skuLoader.load(x.id),
      title: x.title,
      type: x.type.split(","),
    };
  });
}
