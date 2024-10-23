import { ContextType } from "src/ContextType";
import { StatusOrder } from "./OrderResolver";
import { Telegram } from "src/lib/telegram";
import GraphPubSub from "src/lib/PubSub/PubSub";
import { CreateActivity } from "../users/activity/ActivityResolver";
import { table_orders } from "src/generated/tables";

export async function GenerateTokenOrderResolver(
  _,
  { set }: { set: number },
  ctx: ContextType
) {
  const knex = ctx.knex.default;
  const user = ctx.auth;
  const telegram = new Telegram();

  if (!user) {
    return null;
  }

  return await knex.transaction(async (tx) => {
    const item: table_orders = await tx
      .table("orders")
      .where({ set })
      .whereNotIn("status", [StatusOrder.CANCELLED])
      .first();

    if (item) {
      if (item.status === "3" && !item.confirm_checkout_date) {
        return item.uuid;
      }

      if (item.status !== "3") {
        return item.uuid;
      }
    }

    const setting = await knex.table("setting").where("option", "TAX").first();
    const uuid = set + "@" + new Date().getTime();
    const code = Math.floor(1000 + Math.random() * 9000);

    const res = await tx.table("orders").insert({
      uuid,
      customer_number: "",
      set,
      status: StatusOrder.PENDING,
      order: 0,
      total: "0",
      total_paid: "0",
      vat: setting ? setting.value : "0",
      verify_code: code,
      created_by: user.id,
    });

    if (ctx.auth) {
      await CreateActivity(
        _,
        {
          data: {
            userId: ctx.auth.id,
            type: "Create Order",
            description: `តុលេខ (${set}) លេខកូដ (${code})`,
          },
        },
        {
          knex: {
            default: tx,
          },
        }
      );
    }

    const str = `តុលេខ (${set}) លេខកូដ (${code})`;

    telegram.sendMessage(str);

    GraphPubSub.publish("ADMIN_CHANNEL", {
      orderSubscript: { status: "CREAT_NEW", uuid: uuid },
    });

    return res[0] > 0 ? uuid : null;
  });
}

export async function verifyOtpOrder(
  _,
  { token, code }: { token: string; code: string },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const item = await knex
    .table("orders")
    .where({ uuid: token, verify_code: code })
    .whereNotIn("status", [StatusOrder.CANCELLED])
    .first();

  if (item) {
    if (item.status === "3" && Number(item.total_paid || 0) <= 0) {
      return true;
    }
    if (item.status !== "3") {
      return true;
    }
  }

  return false;
}
