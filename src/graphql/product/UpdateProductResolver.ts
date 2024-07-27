import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_products } from "src/generated/tables";

export async function UpdateProducResolver(
  _,
  { id, data }: { id: number; data: Graph.ProductInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const inputProduct: table_products = {
    code: data.code,
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

  const previousSku = data.sku
    .filter((x) => !!x.id)
    .map((x) => ({
      product_id: id,
      name: x.name,
      price: String(x.price),
      discount: String(x.discount),
      unit: x.unit,
      id: x.id,
    }));

  const currentSku = data.sku
    .filter((x) => !x.id)
    .map((x) => ({
      product_id: id,
      name: x.name,
      price: String(x.price),
      discount: String(x.discount),
      unit: x.unit,
    }));

  await knex.transaction(async (tx) => {
    await tx.table("products").where({ id }).update(inputProduct);
    const queries = previousSku.map((x) => {
      return knex
        .table("product_sku")
        .where("id", x.id)
        .update(x)
        .transacting(tx);
    });
    if (previousSku.length > 0) {
      await tx
        .table("product_sku")
        .whereNotIn(
          "id",
          previousSku.map((x) => x.id)
        )
        .del();
    }
    if (currentSku.length > 0) {
      await tx.table("product_sku").insert(currentSku);
    }

    try {
      await Promise.all(queries);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  });

  return true;
}
