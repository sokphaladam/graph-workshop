import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { CreateOrderResolver } from "./CreateOrderResolver";
import { OrderKeyResolver, OrderListResolver } from "./OrderListResolver";
import { ChangeOrderStatusResolver } from "./ChangeOrderStatusResolver";

export enum StatusOrder {
  PENDING = "0",
  VERIFY = "1",
  DELIVERY = "2",
  CHECKOUT = "3",
}

export enum StatusOrderItem {
  PENDING = "0",
  MAKING = "1",
  OUT_OF_STOCK = "2",
  REQUEST_CHANGE = "3",
  COMPLETED = "4",
}

export const OrderResolver = {
  StatusOrder,
  StatusOrderItem,
  Mutation: {
    createOrder: CreateOrderResolver,
    changeOrderStatus: ChangeOrderStatusResolver,
  },
  Query: {
    orderList: OrderListResolver,
    order: OrderKeyResolver,
  },
};
