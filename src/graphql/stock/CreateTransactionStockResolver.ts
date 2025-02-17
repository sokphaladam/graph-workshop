import { ContextType } from "src/ContextType";

export async function CreateTransactionStockResolver(
  _,
  { data },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input = data.map((x) => {
    return {
      id: crypto.randomUUID(),
      product_id: x.productId,
      sku_id: x.skuId,
      transaction_type: x.type,
      qty: x.qty,
      transaction_by: ctx.auth.id,
      description: x.description,
    };
  });

  await knex.table("transaction_stock").insert(input);
  return true;
}
