import { ContextType } from "src/ContextType";
import { table_user_activity } from "src/generated/tables";

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
