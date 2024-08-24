import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { StatusOrder, StatusOrderItem } from "./OrderResolver";
import GraphPubSub from "src/lib/PubSub/PubSub";
import moment from "moment";

interface Props {
  orderId: number;
  id: number;
  status: Graph.StatusOrder;
  itemStatus: Graph.StatusOrderItem;
  reason: string;
}

export async function ChangeOrderStatusResolver(
  _,
  { data }: { data: Props },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const auth = ctx.auth;

  let subStatus: any = data.itemStatus;

  if (data.status) {
    let input: any = {
      status: data.status,
    };

    switch (Number(data.status)) {
      case 1:
        input = {
          status: data.status,
          verify_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          verify_by: auth ? auth.id : null,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        subStatus = StatusOrderItem.MAKING;
        break;
      case 2:
        input = {
          status: data.status,
          deliver_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          deliver_by: auth ? auth.id : null,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        subStatus = StatusOrderItem.COMPLETED;
        break;
      case 3:
        input = {
          status: data.status,
          confirm_checkout_date: moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          confirm_checkout_by: auth ? auth.id : null,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        break;
      case 4:
        input = {
          status: data.status,
          cancelled_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          cancelled_by: auth ? auth.id : null,
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
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
        .whereIn("status", [StatusOrderItem.COMPLETED]);

      const total = items.reduce((a, b) => {
        const dis_price = Number(b.price) * (Number(b.discount) / 100);
        const amount = Number(b.qty) * (Number(b.price) - dis_price);
        return (a = a + amount);
      }, 0);
      const qty = items.reduce((a, b) => (a = a + b.qty), 0);

      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({ ...input, total, order: qty });
    } else {
      console.log(input);
      await knex
        .table("orders")
        .where({ id: data.orderId })
        .update({ ...input });
    }
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
        .update({ status: subStatus });
    }
  }

  GraphPubSub.publish("NEW_ORDER_PENDING", {
    newOrderPending: `Change Status`,
  });

  return true;
}
