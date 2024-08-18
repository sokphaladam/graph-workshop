import { ContextType } from "src/ContextType";
import { createAddonByProductIDLoader } from "src/dataloader/AddonLoader";
import { createCategoryLoader } from "src/dataloader/CategoryLoader";
import { createIntegrateByProductIDLoader } from "src/dataloader/IntegrateLoader";
import { createSkuByProductIDLoader } from "src/dataloader/SkuLoader";

export async function ProductIdResolver(_, { id }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const categoryLoader = createCategoryLoader(knex);
  const skuLoader = createSkuByProductIDLoader(knex);
  const addonLoader = createAddonByProductIDLoader(knex);
  const integrateLoader = createIntegrateByProductIDLoader(knex);

  const item = await knex
    .table("products")
    .where({ id, is_active: true })
    .first();

  return {
    id: item.id,
    code: item.code,
    category: () => categoryLoader.load(item.category_id),
    description: item.description,
    images: item.images,
    sku: () => skuLoader.load(item.id),
    title: item.title,
    type: item.type.split(","),
    addons: () => addonLoader.load(item.id),
    integrates: () => integrateLoader.load(item.id),
    stockAlter: item.stock_alter,
  };
}
