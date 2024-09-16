import { createCategory } from "./resolver/create";
import { category } from "./resolver/id";
import { categoryList } from "./resolver/list";
import { updateCategory } from "./resolver/update";
import { UpdateCategoryIndexResolver } from "./resolver/UpdateCategoryIndexResolver";

export const CategoryResolver = {
  Query: {
    categoryList,
    category,
  },
  Mutation: {
    createCategory,
    updateCategory,
    updateCategoryIndex: UpdateCategoryIndexResolver,
  },
};
