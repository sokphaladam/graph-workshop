import DataLoader from "dataloader";
import { Knex } from "knex";
import { createCategoryLoader } from "./CategoryLoader";

export function createProductByIDLoader(knex: Knex) {
  const loaderCategory = createCategoryLoader(knex);
  return new DataLoader(async (keys: number[]) => {
    const items = await knex
      .table("products")
      .whereIn("id", keys)
      .where("is_active", true);

    return keys.map((row) => {
      const find = items.find((f) => f.id === row);
      if (!find) {
        return null;
      }

      return {
        id: find.id,
        code: find.code,
        title: find.title,
        description: find.description,
        images: find.images,
        type: find.type.split(","),
        category: () => loaderCategory.load(find.category_id),
      };
    });
  });
}
