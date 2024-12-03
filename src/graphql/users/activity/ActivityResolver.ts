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

function isJson(str: string) {
  try {
    JSON.parse(str);
  }catch(e) {
    return false
  }
  return true
}

async function ActivityStaff(_, { userId, type, from, to }, ctx: ContextType) {
  const knex = ctx.knex.default;

  const query = knex.table("user_activity").orderBy("id", "desc")

  if(userId) {
    query.where({ user_id: userId })
  }

  if(type){
    query.whereIn('type', type)
  }

  if(from && to) {
    query.whereBetween('created_at', [from, to])
  }

  const items = await query.clone().select();

  return items.map((x) => {
    const str = String(x.description).split('+');
    return {
      ...x,
      created_at: Formatter.dateTime(x.created_at),
      updated_at: Formatter.dateTime(x.updated_at),
      description: isJson(str[0]) ? JSON.parse(str[0]) : str[0]  
    };
  });
}

export const ActivityResolver = {
  Query: {
    activityStaff: ActivityStaff,
  },
};
