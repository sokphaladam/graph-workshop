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
    stock_alter: data.stockAlter + "",
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
      image: x.image,
      status: x.status,
    }));

  const currentSku = data.sku
    .filter((x) => !x.id)
    .map((x) => ({
      product_id: id,
      name: x.name,
      price: String(x.price),
      discount: String(x.discount),
      unit: x.unit,
      image: x.image,
      status: x.status,
    }));

  const previousAddon = data.addons
    .filter((x) => !!x.id)
    .map((x) => ({
      product_id: id,
      name: x.name,
      value: x.value,
      id: x.id,
      is_required: x.isRequired,
    }));

  const currentAddon = data.addons
    .filter((x) => !x.id)
    .map((x) => ({
      product_id: id,
      name: x.name,
      value: x.value,
      is_required: x.isRequired,
    }));

  const previousIntegrate = data.integrate
    .filter((x) => !!x.id)
    .map((x) => ({
      id: x.id,
      product_id: x.productId,
      integrate_id: x.integrateId,
      qty: x.qty,
    }));

  const currentIntegrate = data.integrate
    .filter((x) => !x.id)
    .map((x) => ({
      product_id: id,
      integrate_id: x.integrateId,
      qty: x.qty,
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
        .where("product_id", id).update({is_active: false})
    }
    if (currentSku.length > 0) {
      await tx.table("product_sku").insert(currentSku);
    }

    //Start script addons
    if (data.addons.length === 0) {
      await knex.table("addon_products").where({ product_id: id }).del();
    } else {
      await previousAddon.map(async (x) => {
        return knex
          .table("addon_products")
          .where("id", x.id)
          .update(x)
          .transacting(tx);
      });
      if (previousAddon.length > 0) {
        await tx
          .table("addon_products")
          .whereNotIn(
            "id",
            previousAddon.map((x) => x.id)
          )
          .where("product_id", id)
          .del();
      }

      if (currentAddon.length > 0) {
        await tx.table("addon_products").insert(currentAddon);
      }
    }
    //End script addons

    const queries3 = previousIntegrate.map((x) => {
      return knex
        .table("product_integrate")
        .where("id", x.id)
        .update(x)
        .transacting(tx);
    });

    if (previousIntegrate.length > 0) {
      await tx
        .table("product_integrate")
        .whereNotIn(
          "id",
          previousIntegrate.map((x) => x.id)
        )
        .where("product_id", id)
        .del();
    }

    if (currentIntegrate.length > 0) {
      await tx.table("product_integrate").insert(currentIntegrate);
    }

    try {
      await Promise.all(queries);
      // await Promise.all(queries2);
      await Promise.all(queries3);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  });

  return true;
}
