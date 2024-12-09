import { ContextType } from "src/ContextType";

export default async function SetItemShowResolver(
  _,
  { productId, skuId, status },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  if (!productId && !skuId) {
    return false;
  }

  if (productId && !skuId) {
    await knex
      .table("product_sku")
      .where({ product_id: productId })
      .update({ enabled_on: status });
    return true;
  } else {
    await knex
      .table("product_sku")
      .where({ id: skuId, product_id: productId })
      .update({ enabled_on: status });
    return true;
  }
}
