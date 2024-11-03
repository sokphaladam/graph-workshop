import { CreateOrderScheduleResolver } from "./CreateOrderScheduleResolver";
import { DeleteOrderScheduleResolver } from "./DeleteOrderScheduleResolver";
import {
  OrderScheduleIdResolver,
  OrderScheduleListResolver,
} from "./OrderScheduleListResolver";
import { UpdateOrderScheduleResolver } from "./UpdateOrderScheduleResolver";

export const OrderScheduleResolver = {
  Query: {
    orderScheduleList: OrderScheduleListResolver,
    orderSchedule: OrderScheduleIdResolver,
  },
  Mutation: {
    createOrderSchedule: CreateOrderScheduleResolver,
    updateOrderSchedule: UpdateOrderScheduleResolver,
    deleteOrderSchedule: DeleteOrderScheduleResolver,
  },
};
