import { createCategory } from "./resolver/create";
import { category } from "./resolver/id";
import { categoryList } from "./resolver/list";
import { updateCategory } from "./resolver/update";

export const CategoryResolver = {
  Query: {
    categoryList,
    category,
  },
  Mutation: {
    createCategory,
    updateCategory,
  },
};
