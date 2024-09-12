import { ContextType } from "src/ContextType";
import { Graph } from "src/generated/graph";
import { table_staff_overtime, table_user_leave } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";
import { CreateActivity } from "../activity/ActivityResolver";

export async function CreateOTResolver(
  _,
  { data, userId }: { data: Graph.OverTimeInput; userId: number },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input = {
    ot_from: data.startat,
    ot_to: data.endAt,
    ot_date: data.otDate,
    status: "REQUEST",
    note: data.note,
    request_by: userId,
    user_id: userId,
    request_date: Formatter.getNowDateTime(),
  };

  await knex.table("staff_overtime").insert(input);
  await CreateActivity(
    _,
    {
      data: {
        userId: userId,
        type: "OT",
        description: `Request OT`,
      },
    },
    ctx
  );
  return true;
}
