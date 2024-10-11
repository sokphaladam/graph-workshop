import { CheckProductCodeResolver } from "./CheckProductCodeResolver";
import { CreateProductResolver } from "./CreateProductResolver";
import { ProductIdResolver } from "./ProductIdResolver";
import { ProductListResolver } from "./ProductListResolver";
import { UpdateProducResolver } from "./UpdateProductResolver";
import { UpdateStatusProducResolver } from "./UpdateStatusResolver";

export const ProductResolver = {
  Mutation: {
    createProduct: CreateProductResolver,
    updateProduct: UpdateProducResolver,
    updateStatusProduct: UpdateStatusProducResolver,
    checkProductCode: CheckProductCodeResolver,
  },
  Query: {
    productList: ProductListResolver,
    product: ProductIdResolver,
  },
};
