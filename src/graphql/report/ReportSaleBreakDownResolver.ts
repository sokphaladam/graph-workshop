import { ContextType } from "src/ContextType";
import { Formatter } from "src/lib/Formatter";

// Individual product detail row
export interface ProductDetail {
  product_id: number;
  sku_id: number;
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
  created_at?: string | null;
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

function buildReport(rows: any[], groupBy?: string) {
  // First, group the rows based on groupBy parameter
  const groupedRows = new Map<string, any[]>();

  rows.forEach((row) => {
    let key: string;
    if (groupBy === "PRODUCT") {
      // Group by product_id and sku_id only
      key = `${row.product_id}-${row.sku_id}`;
    } else {
      // Group by product_id, sku_id, and created_at
      key = `${row.product_id}-${row.sku_id}-${row.created_at}`;
    }

    if (!groupedRows.has(key)) {
      groupedRows.set(key, []);
    }
    groupedRows.get(key)!.push(row);
  });

  // Now aggregate the grouped rows
  const aggregatedRows: any[] = [];
  groupedRows.forEach((group) => {
    const firstRow = group[0];
    const totalQuantity = group.reduce(
      (sum, row) => sum + Number(row.quantity),
      0,
    );
    const totalDiscountAmount = group.reduce(
      (sum, row) => sum + Number(row.discount_item),
      0,
    );

    const aggregated = {
      ...firstRow,
      quantity: totalQuantity,
      discount_item: totalDiscountAmount,
    };
    aggregatedRows.push(aggregated);
  });

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

  aggregatedRows.forEach((row) => {
    // Calculate derived fields
    // Note: Assuming price field should be added to the query or handled separately
    const supply_price = 0; // Currently not available in data
    const total_price = Number(row.quantity) * (row.price || 0); // Price field needed from query
    const discount = Number(row.discount_item); // Handle discount as amount (could be percentage if needed)
    const revenue = total_price - discount;
    const profit = revenue - supply_price;

    // Grand total
    report.grandTotal.quantity += Number(row.quantity);
    report.grandTotal.supply_price += supply_price;
    report.grandTotal.total_price += total_price;
    report.grandTotal.discount += discount;
    report.grandTotal.revenue += revenue;
    report.grandTotal.profit += profit;

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
    cat.summary.supply_price += supply_price;
    cat.summary.total_price += total_price;
    cat.summary.discount += discount;
    cat.summary.revenue += revenue;
    cat.summary.profit += profit;

    // Product detail
    cat.products.push({
      product_id: row.product_id,
      product_code: row.product_code,
      product_name: row.product_name,
      category_name: row.category_name,
      sku_name: row.sku_name,
      quantity: Number(row.quantity),
      supply_price,
      total_price,
      discount,
      revenue,
      profit,
      sku_id: row.sku_id,
      created_at:
        groupBy === "PRODUCT" ? null : Formatter.dateTime(row.created_at),
    });
  });

  return report;
}

export async function ReportSaleBreakDownResolver(
  _: any,
  { from, to, groupBy }: { from: string; to: string; groupBy?: string },
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
      "product_sku.id as sku_id",
      "products.title as product_name",
      "product_sku.name as sku_name",
      "order_items.qty as quantity",
      "order_items.discount as discount_item",
      "order_items.created_at as created_at",
      "order_items.price",
    )
    .where("orders.status", "=", "3")
    .andWhereBetween("orders.created_at", [from, to])
    .orderBy("category.name")
    .orderBy("products.title");

  const discountOrder = await knex
    .table("orders")
    .where("orders.status", "=", "3")
    .andWhere("orders.discount", ">", 0)
    .andWhereBetween("orders.created_at", [from, to]);

  const rows = await query;

  const items = rows
    .filter((row) => {
      const hasDiscount = discountOrder
        .map((dis) => dis.id)
        .includes(row.order_id);

      return !hasDiscount;
    })
    .map((row) => {
      return {
        ...row,
        discount_item: (Number(row.discount_item) * (row.price || 0)) / 100, // Convert discount percentage to amount
      };
    });

  for (const discount of discountOrder) {
    const orderId = discount.id;

    const orderItems = rows.filter((item) => item.order_id === orderId);

    const discountAmount =
      (Number(discount.discount) * Number(discount.total_paid)) / 100;

    const splitDiscount = discountAmount / orderItems.length;

    orderItems.forEach((item) => {
      const currentDiscount =
        (Number(item.discount_item) * (item.price || 0)) / 100;
      const totalDiscount = currentDiscount + splitDiscount;

      items.push({
        ...item,
        discount_item: totalDiscount,
      });
    });
  }

  return (async () => {
    const report = buildReport(items, groupBy);
    return report;
  })();
}
