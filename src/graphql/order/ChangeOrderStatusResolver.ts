import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrderItem } from "./OrderResolver";
import moment from "moment";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { Knex } from "knex";
import { table_orders } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";
import { CreateActivity } from "../users/activity/ActivityResolver";

interface Props {
  orderId: number;
  id: number;
  status: Graph.StatusOrder;
  itemStatus: Graph.StatusOrderItem;
  reason: string;
  amount: string;
  deliverPickupId: number;
  deliverPickupCode: string;
  invoice: number;
  bankType: string;
  currency: string;
  bankId: number;
}

async function DeliveryPick(
  orderId: number,
  deliveryId: number,
  code: string,
  knex: Knex
) {
  const input = {
    delivery_id: deliveryId,
    delivery_code: code,
    updated_at: Formatter.getNowDateTime(),
  };

  await knex.table<table_orders>("orders").where("id", orderId).update(input);
}

export async function ChangeOrderStatusResolver(_, { data }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const auth = ctx.auth;

  if (data.deliverPickupId) {
    await DeliveryPick(
      data.orderId,
      data.deliverPickupId,
      data.deliverPickupCode,
      knex
    );
    return true;
  }

  let subStatus: any = data.itemStatus;

  if (data.status) {
    let input: any = {
      status: data.status,
    };

    switch (Number(data.status)) {
      case 1:
        input = {
          status: data.status,
          verify_date: Formatter.getNowDateTime(),
          verify_by: auth ? auth.id : null,
          updated_at: Formatter.getNowDateTime(),
        };
        subStatus = StatusOrderItem.MAKING;
        break;
      case 2:
        input = {
          status: data.status,
          deliver_date: Formatter.getNowDateTime(),
          deliver_by: auth ? auth.id : null,
          updated_at: Formatter.getNowDateTime(),
        };
        subStatus = StatusOrderItem.COMPLETED;
        break;
      case 3:
        input = {
          status: data.status,
          confirm_checkout_date: Formatter.getNowDateTime(),
          confirm_checkout_by: auth ? auth.id : null,
          updated_at: Formatter.getNowDateTime(),
          note: data.reason || "",
          total_paid: Number(data.amount),
          invoice: Number(data.invoice),
          bank_type: data.bankType,
          currency: data.currency,
          bank: data.bankId,
          discount: data.discount,
          customer_paid: data.customerPaid,
        };
        break;
      case 4:
        input = {
          status: data.status,
          cancelled_date: Formatter.getNowDateTime(),
          cancelled_by: auth ? auth.id : null,
          updated_at: Formatter.getNowDateTime(),
          note: data.reason,
        };
        break;
      default:
        //
        break;
    }

    if (Number(data.status) === 3) {
      const items = await knex
        .table("order_items")
        .where({ order_id: data.orderId })
        .whereIn("status", [
          StatusOrderItem.COMPLETED,
          StatusOrderItem.PENDING,
          StatusOrderItem.MAKING,
        ]);

      const total = items.reduce((a, b) => {
        const dis_price = Number(b.price) * (Number(b.discount) / 100);
        const amount = Number(b.qty) * (Number(b.price) - dis_price);
        return (a = a + amount);
      }, 0);
      const qty = items.reduce((a, b) => (a = a + b.qty), 0);

      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({
          ...input,
          total,
          order: qty,
        });
    }
    // else if (Number(data.status) === 4) {
    //   const items = await knex
    //     .table("order_items")
    //     .where({ order_id: data.orderId })
    //     .count("* as total")
    //     .first<{ total: number }>();

    //   if (Number(items.total) > 0) {
    //     await knex
    //       .table("orders")
    //       .where({ id: data.orderId })
    //       .update({ ...input });
    //   } else {
    //     await knex.table("orders").where({ id: data.orderId }).del();
    //   }
    // }
    else {
      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({ ...input });
    }

    await CreateActivity(
      _,
      {
        data: {
          userId: ctx.auth.id,
          description: JSON.stringify({ input, id: data.orderId }),
          type: "CHANGE_STATUS_ORDER",
        },
      },
      ctx
    );
  }

  if (subStatus) {
    if (data.id) {
      await knex
        .table("order_items")
        .where({ order_id: data.orderId, id: data.id })
        .update({ status: subStatus });
    } else {
      await knex
        .table("order_items")
        .where({ order_id: data.orderId })
        .whereNotIn("status", ["4", "5"])
        .update({ status: subStatus });
    }
  }

  // GraphPubSub.publish("NEW_ORDER_PENDING", {
  //   newOrderPending: `Change Status`,
  // });
  const order = await knex.table("orders").where("id", data.orderId).first();
  GraphPubSub.publish(order.uuid, {
    orderSubscript: { status: "STATUS" },
  });
  GraphPubSub.publish("ADMIN_CHANNEL", {
    orderSubscript: { status: data.status },
  });

  return true;
}
