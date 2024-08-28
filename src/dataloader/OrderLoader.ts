import DataLoader from "dataloader";
import { Knex } from "knex";
import { table_orders } from "src/generated/tables";

export function createOrderLoader(knex: Knex) {
  return new DataLoader(async (keys: number[]) => {
    const orders: table_orders[] = await knex
      .table<table_orders>("orders")
      .whereIn("id", keys);

    return orders.map((x) => {
      return {
        id: x.id,
        set: x.set,
        uuid: x.uuid,
      };
    });
  });
}
