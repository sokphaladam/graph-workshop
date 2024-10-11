import { ContextType } from "src/ContextType";
import { createProductByIDLoader } from "src/dataloader/ProductLoader";
import { createSkuByIDLoader } from "src/dataloader/SkuLoader";

export async function TopProductSellResolver(
  _,
  { from, to, limit, categoryIds },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const loaderProduct = createProductByIDLoader(knex);
  const loaderSku = createSkuByIDLoader(knex);

  const raw = await knex.raw(
    `
    SELECT 
      products.id AS product_id, 
      product_sku.id AS sku_id,
      SUM(order_items.qty) AS total_qty,
      SUM(
        (order_items.price * order_items.qty) - (order_items.price * order_items.qty * order_items.discount / 100) 
      ) AS amount
    FROM products
    INNER JOIN product_sku
    ON product_sku.product_id = products.id
    INNER JOIN order_items
    ON order_items.sku_id = product_sku.id
    INNER JOIN orders
    ON orders.id = order_items.order_id
    WHERE products.is_active = TRUE
    AND product_sku.is_active = TRUE
    AND orders.status = "3"
    AND DATE(orders.confirm_checkout_date) BETWEEN :from AND :to
    ${
      categoryIds
        ? `AND products.category_id IN (${categoryIds.join(",")})`
        : ""
    }
    GROUP BY product_sku.id
    ORDER BY total_qty DESC
    LIMIT 0, :limit
  `,
    { from, to, limit }
  );

  return raw[0].map((x) => {
    return {
      product: () => loaderProduct.load(x.product_id),
      sku: () => loaderSku.load(x.sku_id),
      qty: x.total_qty,
      total: Number(x.amount).toFixed(2),
    };
  });
}
