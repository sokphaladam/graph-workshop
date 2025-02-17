import { ContextType } from "src/ContextType";
import { createProductByIDLoader } from "src/dataloader/ProductLoader";
import { createSkuByIDLoader } from "src/dataloader/SkuLoader";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import { Formatter } from "src/lib/Formatter";

export async function TransactionStockListResolver(
  _,
  { offset, limit },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const productLoader = createProductByIDLoader(knex);
  const skuLoader = createSkuByIDLoader(knex);
  const userLoader = createUserByIdLoader(knex);

  const items = await knex
    .table("transaction_stock")
    .offset(offset)
    .limit(limit)
    .orderBy("created_at", "desc");

  return items.map((x) => {
    return {
      id: x.id,
      product: () => productLoader.load(x.product_id),
      sku: () => skuLoader.load(x.sku_id),
      type: x.transaction_type,
      qty: x.qty,
      date: Formatter.dateTime(x.created_at),
      by: () => userLoader.load(x.transaction_by),
      description: x.description,
    };
  });
}
