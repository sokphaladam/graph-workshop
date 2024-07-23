import { CreateProductResolver } from "./CreateProductResolver";
import { ProductIdResolver } from "./ProductIdResolver";
import { ProductListResolver } from "./ProductListResolver";
import { UpdateProducResolver } from "./UpdateProductResolver";

export const ProductResolver = {
  Mutation: {
    createProduct: CreateProductResolver,
    updateProduct: UpdateProducResolver,
  },
  Query: {
    productList: ProductListResolver,
    product: ProductIdResolver,
  },
};
