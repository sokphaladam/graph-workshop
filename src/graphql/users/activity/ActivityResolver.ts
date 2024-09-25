import { ContextType } from "src/ContextType";
import { table_user_activity } from "src/generated/tables";
import { Formatter } from "src/lib/Formatter";

export interface PropsActivityInput {
  userId: number;
  description: string;
  type: string;
}

export async function CreateActivity(
  _,
  { data }: { data: PropsActivityInput },
  ctx: ContextType
) {
  const knex = ctx.knex.default;

  const input: table_user_activity = {
    user_id: data.userId,
    type: data.type,
    description: data.description,
  };

  await knex.table("user_activity").insert(input);

  return true;
}

async function ActivityStaff(_, { userId }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const items = await knex
    .table("user_activity")
    .where({ user_id: userId })
    .orderBy("id", "desc")
    .limit(50)
    .offset(0);

  return items.map((x) => {
    return {
      ...x,
      created_at: Formatter.dateTime(x.created_at),
      updated_at: Formatter.dateTime(x.updated_at),
    };
  });
}

export const ActivityResolver = {
  Query: {
    activityStaff: ActivityStaff,
  },
};
