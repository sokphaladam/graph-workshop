import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import { CategoryResolver } from "./category/CatgoryResolver";
import { loadSchema } from "./SchemaLoader";
import { UserResolver } from "./users/UserResolver";
import { ProductResolver } from "./product/ProductResolver";
import { OrderResolver } from "./order/OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { SubscriptionResolvers } from "./subscription";
import { SettingResolver } from "./setting/SettingResolver";
import { Telegram } from "src/lib/telegram";

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
  SettingResolver,
  {
    Query: {
      books: () => books,
    },
    Mutation: {
      testSubscription: (_, { str }) => {
        const tele = new Telegram();
        GraphPubSub.publish("ADMIN_CHANNEL", {
          newOrderPending: str,
        });
        tele.sendMessage(str);
        return true;
      },
    },
    Subscription: SubscriptionResolvers,
  },
];
