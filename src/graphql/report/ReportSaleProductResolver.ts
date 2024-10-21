import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

export async function ReportSaleProductResolver(
  _,
  { from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const query = await knex.raw(
    `
    SELECT 
      DATE(orders.confirm_checkout_date) AS "date", 
      category.name, 
      CONCAT(products.title, "(", product_sku.name ,")") AS product_name, 
      product_sku.price, 
      SUM(order_items.qty) AS qty,
      SUM(order_items.qty * (order_items.price - (order_items.price * order_items.discount / 100))) AS amount
    FROM products
    INNER JOIN product_sku
    ON product_sku.product_id = products.id
    INNER JOIN order_items
    ON order_items.sku_id = product_sku.id
    INNER JOIN orders
    ON orders.id = order_items.order_id
    INNER JOIN category
    ON category.id = products.category_id
    WHERE products.is_active = TRUE AND product_sku.is_active = TRUE AND orders.status = "3"
    AND DATE(orders.confirm_checkout_date) between :from AND :to
    GROUP BY product_sku.id, DATE(orders.confirm_checkout_date)
    ORDER BY DATE(orders.confirm_checkout_date) desc;
`,
    { from, to }
  );

  return query[0].map((x) => {
    return {
      ...x,
      date: Formatter.date(x.date),
    };
  });
}
