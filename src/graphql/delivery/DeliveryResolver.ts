import {
  CreateDeliveryResolver,
  UpdateDeliveryResolver,
} from "./CreateDeliveryResolver";
import {
  DeliveryIDResolver,
  DeliveryListResolver,
} from "./DeliveryListResolver";

export const DeliveryResolver = {
  Query: {
    deliveryList: DeliveryListResolver,
    deliveryById: DeliveryIDResolver,
  },
  Mutation: {
    createDelivery: CreateDeliveryResolver,
    updateDelivery: UpdateDeliveryResolver,
  },
};
