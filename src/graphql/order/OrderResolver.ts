import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { CreateOrderResolver } from "./CreateOrderResolver";
import { OrderListResolver } from "./OrderListResolver";

export const OrderResolver = {
  Mutation: {
    createOrder: CreateOrderResolver,
  },
  Query: {
    orderList: OrderListResolver,
  },
};
