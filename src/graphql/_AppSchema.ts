import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import { CategoryResolver } from "./category/CatgoryResolver";
import { loadSchema } from "./SchemaLoader";
import { UserResolver } from "./users/UserResolver";
import { ProductResolver } from "./product/ProductResolver";
import { OrderResolver } from "./order/OrderResolver";

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const AppSchema = loadSchema();

export const AppResolvers = [
  {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  },
  UserResolver,
  CategoryResolver,
  ProductResolver,
  OrderResolver,
  {
    Query: {
      books: () => books,
    },
  },
];
