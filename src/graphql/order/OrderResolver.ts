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
import { AddDiscountOrderResolver } from "./AddDiscountOrderResolver";
import { SetTypePaymentOrderResolver } from "./SetTypePaymentOrderResolver";
import { OrderItemResolver } from "./OrderItemResolver";
import { OrderScheduleResolver } from "./schedule/OrderScheduleResolver";
import { MarkFirstPrintOrderResolver } from "./MarkFirstPrintOrderResolver";
import { OrderMergeReolver } from "./OrderMergeReolver";

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
  QUICK_ORDER = "3",
}

export const OrderResolver = {
  StatusOrder,
  StatusOrderItem,
  OrderViewBy,
  Mutation: {
    ...OrderScheduleResolver.Mutation,
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
    addDiscountOrder: AddDiscountOrderResolver,
    setTypePaymentOrder: SetTypePaymentOrderResolver,
    markFirstPrintOrder: MarkFirstPrintOrderResolver,
    mergeOrder: OrderMergeReolver,
  },
  Query: {
    ...OrderScheduleResolver.Query,
    orderList: OrderListResolver,
    order: OrderKeyResolver,
    orderItem: OrderItemResolver,
  },
};
