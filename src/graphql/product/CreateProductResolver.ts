import moment from "moment";
import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_product_sku, table_products } from "src/generated/tables";
import { prefix } from "src/lib/prefix";

export async function CreateProductResolver(
  _,
  { data }: { data: Graph.ProductInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const code = prefix("9Z") + new Date().getTime();

  const inputProduct: table_products = {
    code: data.code ? data.code : code,
    brand_id: 0,
    category_id: data.category || 0,
    color: "",
    created_at: new Date(),
    current_qty: 0,
    description: data.description,
    discount: "0",
    height: "0",
    images: data.images,
    is_active: 1,
    length: "",
    price: "0",
    sale_price: "0",
    size: "",
    supplier_id: 0,
    title: data.title,
    type: data.type.join(","),
    unit: "",
    weight: "",
    width: "",
  };

  const creat = await knex.transaction((tx) => {
    return tx
      .table<table_products>("products")
      .insert(inputProduct)
      .then((res) => {
        return tx.table<table_product_sku>("product_sku").insert(
          data.sku.map((x) => ({
            product_id: res[0],
            name: x.name,
            price: String(x.price),
            discount: String(x.discount),
            unit: x.unit,
          }))
        );
      });
  });

  return creat[0] > 0;
}
