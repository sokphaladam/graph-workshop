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
import { TableSetResolver } from "./set/TableSetReolver";
import { DeliveryResolver } from "./delivery/DeliveryResolver";
import { PositionResolver } from "./position/PositionResolver";
import { BankResolver } from "./bank/BankResolver";
import { AttendanceResolver } from "./attandance/AttandanceResolver";
import { ShiftResolver } from "./users/shift/ShiftResolver";
import { LeaveResolver } from "./users/leave/LeaveResolver";
import { OverTimeResolver } from "./users/overtime/OverTimeResolver";
import { ReportResolver } from "./report/ReportResolver";
import { ActivityResolver } from "./users/activity/ActivityResolver";

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
  TableSetResolver,
  DeliveryResolver,
  PositionResolver,
  BankResolver,
  AttendanceResolver,
  ShiftResolver,
  LeaveResolver,
  OverTimeResolver,
  ReportResolver,
  ActivityResolver,
  {
    Query: {
      books: () => books,
    },
    Mutation: {
      testSubscription: (_, { str }) => {
        const tele = new Telegram();
        GraphPubSub.publish("ADMIN_CHANNEL", {
          newOrderPending: str,
          orderSubscript: str,
        });
        // tele.sendMessage(str);
        return true;
      },
    },
    Subscription: SubscriptionResolvers,
  },
];
