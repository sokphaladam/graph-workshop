import DataLoader from "dataloader";
import { Knex } from "knex";
import { table_delivery, table_orders } from "src/generated/tables";
import { LogStatus } from "src/graphql/order/OrderListResolver";
import { createOrderItemLoader } from "./OrderItemLoader";
import { createUserLoader } from "./UserLoader";
import { StatusOrder } from "src/graphql/order/OrderResolver";

export function createDeliveryByIDLoader(knex: Knex) {
  const loaderOrderItem = createOrderItemLoader(knex);
  const loaderUser = createUserLoader(knex);
  return new DataLoader(async (keys: number[]) => {
    const delivery: table_delivery[] = await knex
      .table<table_delivery>("delivery")
      .where("active", "=", true)
      .whereIn("id", keys);

    return keys.map((row) => {
      const find = delivery.find((f) => f.id === row);

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        name: find.name,
        contact: find.contact,
      };
    });
  });
}
