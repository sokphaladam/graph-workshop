import { CreateOrderResolver } from "./CreateOrderResolver";
import { OrderKeyResolver, OrderListResolver } from "./OrderListResolver";
import { ChangeOrderStatusResolver } from "./ChangeOrderStatusResolver";
import { GenerateTokenOrderResolver } from "./GenerateTokenOrderResolver";
import { AddOrderItemResolver } from "./items/AddOrderItemResolver";
import {
  DecreaseOrderItemResolver,
  IncreaseOrderItemResolver,
  RemoveOrderItemResolver,
} from "./items/RemoveOrderItemResolver";

export enum StatusOrder {
  PENDING = "0",
  VERIFY = "1",
  DELIVERY = "2",
  CHECKOUT = "3",
  CANCELLED = "4",
}

export enum StatusOrderItem {
  PENDING = "0",
  MAKING = "1",
  OUT_OF_STOCK = "2",
  REQUEST_CHANGE = "3",
  COMPLETED = "4",
  DELETED = "5",
}

export const OrderResolver = {
  StatusOrder,
  StatusOrderItem,
  Mutation: {
    createOrder: CreateOrderResolver,
    changeOrderStatus: ChangeOrderStatusResolver,
    addOrderItem: AddOrderItemResolver,
    markOrderItemStatus: RemoveOrderItemResolver,
    increaseOrderItem: IncreaseOrderItemResolver,
    decreaseOrderItem: DecreaseOrderItemResolver,
  },
  Query: {
    orderList: OrderListResolver,
    order: OrderKeyResolver,
    generateTokenOrder: GenerateTokenOrderResolver,
  },
};
