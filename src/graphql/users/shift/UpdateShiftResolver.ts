import moment from "moment";
import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_shift } from "src/generated/tables";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export async function UpdateShiftResolver(
  _,
  {
    id,
    data,
    expected,
  }: { id: number; data: Graph.ShiftInput; expected: boolean },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  await knex.transaction(async (tx) => {
    const input: table_shift = {
      open: data.open,
      open_usd: String(data.openCurrency.usd),
      open_khr: String(data.openCurrency.khr),
      user_id: data.userId,
      deposit: data.deposit,
      note: data.note,
      close: data.close,
    };

    if (!!expected) {
      const orders = await tx
        .table("orders")
        .where({
          status: "3",
        })
        .whereBetween("confirm_checkout_date", [data.open, data.close]);

      const setting = await tx
        .table("setting")
        .where("option", "EXCHANGE_RATE")
        .first();

      const cards = await tx.table("bank_info");

      const groupcard = groupBy(orders, "bank");
      if (groupcard[1]) {
        const usd = groupcard[1]
          .filter((x) => x.currency === "USD" && x.bank === 1)
          .reduce((a, b) => (a = Number(a) + Number(b.total_paid)), 0);
        const khr = groupcard[1]
          .filter((x) => x.currency === "KHR" && x.bank === 1)
          .reduce((a, b) => (a = Number(a) + Number(b.total_paid)), 0);

        input.close_usd = String(Number(data.openCurrency.usd) + Number(usd));
        input.close_khr = String(
          Number(data.openCurrency.khr) + Number(khr * setting.value)
        );
        input.expect_usd = String(Number(data.openCurrency.usd) + Number(usd));
        input.expect_khr = String(
          Number(data.openCurrency.khr) + Number(khr * setting.value)
        );
      }

      const cardInput = [];

      for (const c of Object.keys(groupcard).filter((x) => Number(x) > 1)) {
        const cc = cards.find((f) => Number(f.id) === Number(c)).name;
        const cv = (groupcard[c] as any[]).reduce(
          (a, b) => (a = Number(a) + Number(b.total_paid)),
          0
        );
        cardInput.push({
          name: `${cc}`,
          value: cv.toFixed(2),
          qty: (groupcard[c] as any[]).length,
        });
      }
      input.bank = JSON.stringify(cardInput);
      input.bill = orders.length.toString();
      input.card = cardInput.reduce((a, b) => (a = a + b.qty), 0);
    }

    await knex.table("shift").update(input).where({ id: id });
  });

  return true;
}
