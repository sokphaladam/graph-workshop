import moment from "moment";
import { ContextType } from "src/ContextType";

export async function ReportSaleByDayResolver(
  _,
  { from, to },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const query = knex.table("orders").where({ status: "3" });

  if (from && to) {
    query.whereBetween("confirm_checkout_date", [
      from + " 00:00:00",
      to + " 23:59:00",
    ]);
  }

  const orders = await query.clone().select();

  const items = await knex.table("order_items").whereIn(
    "order_id",
    orders.map((x) => x.id)
  );

  const products = await knex
    .table("products")
    .innerJoin("product_sku", "product_sku.product_id", "products.id")
    .where({ "products.is_active": true, "product_sku.is_active": true })
    .select("product_sku.id as sku_id", "title", "product_sku.name as name");

  const groups = orders.reduce((acc, item) => {
    const date = moment(item.confirm_checkout_date).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return {
    header: products.map((x) =>
      `${x.title} (${x.name})`.replace(/[\u200B-\u200D\uFEFF]/g, "").trim()
    ),
    data: Object.keys(groups).map((x) => {
      const groupProduct = products.reduce((acc, item) => {
        const find = items.filter(
          (f) =>
            moment(f.created_at).format("YYYY-MM-DD") === x &&
            f.sku_id === item.sku_id
        );
        return {
          ...acc,
          [`${item.title} (${item.name})`
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .trim()]: {
            qty: find.reduce((a, b) => (a = a + b.qty), 0),
            total: find
              .reduce(
                (a, b) =>
                  (a =
                    a + b.price * b.qty - (b.price * b.qty * b.discount) / 100),
                0
              )
              .toFixed(2),
          },
        };
      }, {});

      return {
        ...groups[x].reduce((a, b) => {
          const disPrice =
            (Number(b.total_paid || 0) * Number(b.discount || 0)) / 100;
          const fixedPrice = Number(b.total_paid || 0) - disPrice;
          return {
            date: x,
            qty: (a.qty || 0) + (b.order || 0),
            totalAmount: (a.totalAmount || 0) + Number(b.total_paid || 0),
            totalDiscount: (a.totalDiscount || 0) + disPrice,
            totalAfterDiscount: (a.totalAfterDiscount || 0) + fixedPrice,
          };
        }, {}),
        ...groupProduct,
      };
    }),
  };
}
