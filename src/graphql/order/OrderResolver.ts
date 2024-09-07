import { CreateOrderResolver } from "./CreateOrderResolver";
import { OrderKeyResolver, OrderListResolver } from "./OrderListResolver";
import { ChangeOrderStatusResolver } from "./ChangeOrderStatusResolver";
import {
  GenerateTokenOrderResolver,
  verifyOtpOrder,
} from "./GenerateTokenOrderResolver";
import { AddOrderItemResolver } from "./items/AddOrderItemResolver";
import {
  DecreaseOrderItemResolver,
  IncreaseOrderItemResolver,
  RemoveOrderItemResolver,
} from "./items/RemoveOrderItemResolver";
import { SignatureOrderResolver } from "./SignatureOrderResolver";
import { PeopleInOrderResolver } from "./PeopleInOrderResolver";

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

export enum OrderViewBy {
  KITCHEN = "0",
  ADMIN = "1",
  USER = "2",
}

export const OrderResolver = {
  StatusOrder,
  StatusOrderItem,
  OrderViewBy,
  Mutation: {
    createOrder: CreateOrderResolver,
    changeOrderStatus: ChangeOrderStatusResolver,
    addOrderItem: AddOrderItemResolver,
    markOrderItemStatus: RemoveOrderItemResolver,
    increaseOrderItem: IncreaseOrderItemResolver,
    decreaseOrderItem: DecreaseOrderItemResolver,
    generateTokenOrder: GenerateTokenOrderResolver,
    verifyOtpOrder,
    signatureOrder: SignatureOrderResolver,
    peopleInOrder: PeopleInOrderResolver,
  },
  Query: {
    orderList: OrderListResolver,
    order: OrderKeyResolver,
  },
};
