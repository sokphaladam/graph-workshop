import { ContextType } from "src/ContextType";
import { createAddonByProductIDLoader } from "src/dataloader/AddonLoader";
import { createCategoryLoader } from "src/dataloader/CategoryLoader";
import { createIntegrateByProductIDLoader } from "src/dataloader/IntegrateLoader";
import { createSkuByProductIDLoader } from "src/dataloader/SkuLoader";
import { table_products } from "src/generated/tables";

export async function ProductListResolver(
  _,
  { offset, limit, code, filter },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const categoryLoader = createCategoryLoader(knex);
  const skuLoader = createSkuByProductIDLoader(knex);
  const addonLoader = createAddonByProductIDLoader(knex);
  const integrateLoader = createIntegrateByProductIDLoader(knex);

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

    if (filter.type) {
      queries.whereIn("type", filter.type);
    }

    if (filter.isLowStock) {
      queries.whereRaw("stock <= stock_alter");
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
      addons: () => addonLoader.load(x.id),
      integrates: () => integrateLoader.load(x.id),
      stockAlter: x.stock_alter,
    };
  });
}
