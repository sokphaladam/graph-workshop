import { ContextType } from "src/ContextType";
import { createOrderItemLoader } from "src/dataloader/OrderItemLoader";
import { table_orders } from "src/generated/tables";
import { OrderViewBy, StatusOrder, StatusOrderItem } from "./OrderResolver";
import moment from "moment";
import { createUserByIdLoader } from "src/dataloader/UserLoader";
import DataLoader from "dataloader";
import { createDeliveryByIDLoader } from "src/dataloader/DeliverLoader";
import { Formatter } from "src/lib/Formatter";

export function LogStatus(
  order: table_orders,
  loader: DataLoader<
    number,
    {
      id: number;
      display: string;
    },
    number
  >
) {
  const logs = [
    {
      date: moment(order.created_at).format("YYYY-MM-DD HH:mm"),
      text: "Created",
      by: null,
    },
  ];

  if (order.verify_date) {
    logs.push({
      date: moment(order.verify_date).format("YYYY-MM-DD HH:mm"),
      text: "Verifed",
      by: order.verify_by ? () => loader.load(order.verify_by) : null,
    });
  }

  if (order.deliver_date) {
    logs.push({
      date: moment(order.deliver_date).format("YYYY-MM-DD HH:mm"),
      text: "Deliver",
      by: order.deliver_by ? () => loader.load(order.deliver_by) : null,
    });
  }

  if (order.confirm_checkout_date) {
    logs.push({
      date: moment(order.confirm_checkout_date).format("YYYY-MM-DD HH:mm"),
      text: "Checkout",
      by: order.confirm_checkout_by
        ? () => loader.load(order.confirm_checkout_by)
        : null,
    });
  }

  if (order.cancelled_date) {
    logs.push({
      date: moment(order.cancelled_date).format("YYYY-MM-DD HH:mm"),
      text: "Cancelled",
      by: order.cancelled_by ? () => loader.load(order.cancelled_by) : null,
    });
  }

  if (order.signature_date) {
    logs.push({
      date: moment(order.signature_date).format("YYYY-MM-DD HH:mm"),
      text: "Signature",
      by: order.signature_by ? () => loader.load(order.signature_by) : null,
    });
  }

  if (logs.length > 1) {
    if (order.updated_at) {
      logs.push({
        date: moment(order.updated_at).format("YYYY-MM-DD HH:mm"),
        text: "Last Updated",
        by: null,
      });
    }
  }

  return logs;
}

export async function OrderListResolver(
  _,
  { offset, limit, viewBy, status, orderId, fromDate, toDate },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const loader = createOrderItemLoader(knex, viewBy === OrderViewBy.KITCHEN);
  const loaderUser = createUserByIdLoader(knex);
  const loaderDeliver = createDeliveryByIDLoader(knex);

  const now = Formatter.getNowDate();

  const query = knex
    .table("orders")
    .innerJoin("order_items", "order_items.order_id", "orders.id")
    .whereRaw('DATE(orders.created_at) = :date', {date: now})
    .offset(offset)
    .limit(limit)
    .select("orders.*")
    .groupBy("orders.id");

  if(status[0] === '3') {
    query.orderBy('confirm_checkout_date', 'desc')
  }else {
    query.orderBy([
      { column: "id", order: "asc" },
      { column: "status", order: "asc" },
    ])
  }

  if (orderId) {
    const items = await query.clone().where("id", orderId);

    return items.map((x) => {
      return {
        id: x.id,
        name: x.customer_number,
        address: x.address,
        set: x.set,
        status: isNaN(Number(x.status)) ? StatusOrder[x.status] : x.status,
        uuid: x.uuid,
        items: () => loader.load(x.id),
        total: x.total,
        paid: x.total_paid,
        note: x.note,
        log: LogStatus(x, loaderUser),
        delivery: x.delivery_id
          ? () => loaderDeliver.load(x.delivery_id)
          : null,
        deliveryCode: x.delivery_code,
        bankType: (x as any).bank_type,
      };
    });
  }

  if (status && (status as StatusOrder[]).length > 0) {
    query.whereIn("orders.status", status);
  }

  if (viewBy === OrderViewBy.KITCHEN) {
    query.whereIn("orders.status", [
      StatusOrder.PENDING,
      StatusOrder.VERIFY,
      StatusOrder.DELIVERY,
    ]);
  }

  if (fromDate && toDate) {
    query.whereBetween("orders.verify_date", [fromDate, toDate]);
  }

  const items: table_orders[] = await query;

  return items.map((x) => {
    const logs = LogStatus(x, loaderUser);
    return {
      id: x.id,
      name: x.customer_number,
      address: x.address,
      set: x.set,
      status: isNaN(Number(x.status)) ? StatusOrder[x.status] : x.status,
      uuid: x.uuid,
      items: () => loader.load(x.id),
      total: x.total,
      paid: x.total_paid,
      note: x.note,
      log: logs,
      code: (x as any).verify_code,
      vat: (x as any).vat,
      delivery: x.delivery_id ? () => loaderDeliver.load(x.delivery_id) : null,
      deliveryCode: x.delivery_code,
      invoice: (x as any).invoice,
      bankType: (x as any).bank_type,
      person: (x as any).person,
      discount: (x as any).discount,
    };
  });
}

export async function OrderKeyResolver(_, { id, token }, ctx: ContextType) {
  const knex = ctx.knex.default;
  const loader = createOrderItemLoader(knex);
  const loaderUser = createUserByIdLoader(ctx.knex.default);
  const loaderDeliver = createDeliveryByIDLoader(knex);

  if (!token && !id) {
    return null;
  }

  const query = knex.table("orders").first();

  if (id) {
    query.where({ id });
  }

  if (token) {
    query.where({ uuid: token });
  }

  const item: table_orders = await query.clone();

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.customer_number,
    address: item.address,
    set: item.set,
    status: isNaN(Number(item.status)) ? StatusOrder[item.status] : item.status,
    uuid: item.uuid,
    items: () => loader.load(item.id),
    total: item.total,
    paid: item.total_paid,
    log: LogStatus(item, loaderUser),
    code: (item as any).verify_code,
    vat: (item as any).vat,
    delivery: item.delivery_id
      ? () => loaderDeliver.load(item.delivery_id)
      : null,
    deliveryCode: item.delivery_code,
    invoice: (item as any).invoice,
    bankType: (item as any).bank_type,
    person: (item as any).person,
    discount: (item as any).discount,
  };
}
