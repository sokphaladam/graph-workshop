import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { Formatter } from "src/lib/Formatter";

export async function ReportSaleProductResolver(
  _,
  { from, to, filters, groupBy },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const query = knex
    .table("products")
    .innerJoin("product_sku", "products.id", "product_sku.product_id")
    .innerJoin("order_items", "order_items.sku_id", "product_sku.id")
    .innerJoin("orders", "orders.id", "order_items.order_id")
    .innerJoin("category", "category.id", "products.category_id")
    .where({
      "products.is_active": true,
      "product_sku.is_active": true,
      "orders.status": "3",
    })
    .whereBetween("orders.confirm_checkout_date", [
      from + " 00:00:00",
      to + " 23:59:00",
    ])
    .groupByRaw("product_sku.id, DATE(orders.confirm_checkout_date)")
    .orderByRaw(
      "DATE(orders.confirm_checkout_date) DESC, SUM(order_items.qty * (order_items.price - (order_items.price * order_items.discount / 100))) DESC"
    )
    .select(
      knex.raw(
        `DATE(orders.confirm_checkout_date) AS "date",
        products.id,
        product_sku.image,
        products.images as productImage,
        category.name as categoryName, 
        CONCAT(products.title, "(", product_sku.name ,")") AS productName, 
        product_sku.price, 
        SUM(order_items.qty) AS qty,
        SUM(order_items.qty * (order_items.price - (order_items.price * order_items.discount / 100))) AS amount`
      )
    );

  if (filters) {
    if (filters.category && filters.category.length > 0) {
      query.whereIn("products.category_id", filters.category);
    }
  }

  if ((groupBy as Graph.ReportSaleGroupBy) === "DATE") {
    const items = await knex
      .table("orders")
      .where({
        status: "3",
      })
      .whereBetween("orders.confirm_checkout_date", [
        from + " 00:00:00",
        to + " 23:59:00",
      ])
      .groupByRaw(`DATE(orders.confirm_checkout_date)`)
      .orderByRaw(`DATE(orders.confirm_checkout_date) desc`)
      .select(
        knex.raw(
          `DATE(orders.confirm_checkout_date) AS "date",
      SUM(if(orders.bank = 1, (orders.total_paid - (orders.total_paid * orders.discount / 100)), 0)) as cash,
      SUM(if(orders.bank = 2, (orders.total_paid - (orders.total_paid * orders.discount / 100)), 0)) as aba, 
      SUM(if(orders.discount > 0, (orders.total_paid * orders.discount) / 100, 0)) as discount, 
      SUM((orders.total_paid - (orders.total_paid * orders.discount / 100))) AS amount`
        )
      );

    return items.map((x) => {
      return {
        ...x,
        date: Formatter.date(x.date),
      };
    });
  }

  const items = await query.clone();

  return items.map((x) => {
    return {
      ...x,
      date: Formatter.date(x.date),
    };
  });
}
