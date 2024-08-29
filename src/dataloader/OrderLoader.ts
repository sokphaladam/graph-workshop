import DataLoader from "dataloader";
import { Knex } from "knex";
import { table_orders } from "src/generated/tables";
import { LogStatus } from "src/graphql/order/OrderListResolver";
import { createOrderItemLoader } from "./OrderItemLoader";
import { createUserLoader } from "./UserLoader";
import { StatusOrder } from "src/graphql/order/OrderResolver";
import { createDeliveryByIDLoader } from "./DeliverLoader";

export function createOrderByIDLoader(knex: Knex) {
  const loaderOrderItem = createOrderItemLoader(knex);
  const loaderUser = createUserLoader(knex);
  const loaderDelivery = createDeliveryByIDLoader(knex);
  return new DataLoader(async (keys: number[]) => {
    const orders: table_orders[] = await knex
      .table<table_orders>("orders")
      .whereIn("id", keys);

    return keys.map((row) => {
      const find = orders.find((f) => f.id === row);

      if (!find) {
        return null;
      }

      return {
        id: find.id,
        set: find.set,
        uuid: find.uuid,
        address: find.address,
        status: isNaN(Number(find.status))
          ? StatusOrder[find.status]
          : find.status,
        items: find.id ? () => loaderOrderItem.load(find.id) : null,
        total: find.total,
        paid: find.total_paid,
        note: find.note,
        log: LogStatus(find, loaderUser),
        delivery: find.delivery_id
          ? () => loaderDelivery.load(find.delivery_id)
          : null,
        deliveryCode: find.delivery_code,
      };
    });
  });
}
