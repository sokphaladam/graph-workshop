import { ContextType } from "src/ContextType";

// Individual product detail row
export interface ProductDetail {
  product_id: number;
  product_code: string;
  product_name: string;
  category_name: string;
  sku_name: string;
  quantity: number;
  supply_price: number;
  total_price: number;
  discount: number;
  revenue: number;
  profit: number;
}
// Category summary (aggregated totals + product list)
export interface CategorySummary {
  category: string;
  summary: {
    quantity: number;
    supply_price: number;
    total_price: number;
    discount: number;
    revenue: number;
    profit: number;
  };
  products: ProductDetail[];
}
// Grand total across all categories
export interface GrandTotal {
  quantity: number;
  supply_price: number;
  total_price: number;
  discount: number;
  revenue: number;
  profit: number;
}
// Full report structure
export interface SaleBreakdownReport {
  grandTotal: GrandTotal;
  categories: Record<string, CategorySummary>;
}

function buildReport(rows: any[]) {
  const report = {
    grandTotal: {
      quantity: 0,
      supply_price: 0,
      total_price: 0,
      discount: 0,
      revenue: 0,
      profit: 0,
    },
    categories: {} as Record<string, CategorySummary>,
  };

  rows.forEach((row) => {
    // Grand total
    report.grandTotal.quantity += Number(row.quantity);
    report.grandTotal.supply_price += Number(row.supply_price);
    report.grandTotal.total_price += Number(row.total_price);
    report.grandTotal.discount += Number(row.discount);
    report.grandTotal.revenue += Number(row.revenue);
    report.grandTotal.profit += Number(row.profit);
    // Category summary
    if (!report.categories[row.category_name]) {
      report.categories[row.category_name] = {
        category: row.category_name,
        summary: {
          quantity: 0,
          supply_price: 0,
          total_price: 0,
          discount: 0,
          revenue: 0,
          profit: 0,
        },
        products: [],
      };
    }
    const cat = report.categories[row.category_name];
    cat.summary.quantity += Number(row.quantity);
    cat.summary.supply_price += Number(row.supply_price);
    cat.summary.total_price += Number(row.total_price);
    cat.summary.discount += Number(row.discount);
    cat.summary.revenue += Number(row.revenue);
    cat.summary.profit += Number(row.profit);
    // Product detail
    cat.products.push(row);
  });

  return report;
}

export function ReportSaleBreakDownResolver(
  _: any,
  { from, to }: { from: string; to: string },
  ctx: ContextType,
): Promise<SaleBreakdownReport> {
  const knex = ctx.knex.default;

  const query = knex
    .table("order_items")
    .join("orders", "order_items.order_id", "orders.id")
    .join("products", "order_items.product_id", "products.id")
    .join("category", "products.category_id", "category.id")
    .join("product_sku", "order_items.sku_id", "product_sku.id")
    .select(
      "category.name as category_name",
      "order_items.product_id",
      "products.code as product_code",
      "products.title as product_name",
      "product_sku.name as sku_name",
      knex.raw("SUM(order_items.qty) as quantity"),
      knex.raw("SUM(0 * order_items.qty) as supply_price"),
      knex.raw("SUM(order_items.qty * order_items.price) as total_price"),
      knex.raw("SUM(order_items.discount) as discount"),
      knex.raw(
        "SUM(order_items.qty * order_items.price - order_items.discount) as revenue",
      ),
      knex.raw(
        "SUM((order_items.qty * order_items.price - order_items.discount) - (0 * order_items.qty)) as profit",
      ),
    )
    .where("orders.status", "=", "3")
    .andWhereBetween("orders.created_at", [from, to])
    .groupBy("category.name", "order_items.product_id", "order_items.sku_id")
    .orderBy("category.name")
    .orderBy("products.title");

  return (async () => {
    const rows = await query;
    const report = buildReport(rows);
    return report;
  })();
}
