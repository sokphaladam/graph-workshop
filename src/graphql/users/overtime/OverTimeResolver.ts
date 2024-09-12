import { CreateOTResolver } from "./CreateOTResolver";
import { OverTimeById, OverTimeListResolver } from "./OverTimeListResolver";
import { UpdateOTResolver } from "./UpdateOTResolver";
import { UpdateOTStatus } from "./UpdateOTStatus";

export const OverTimeResolver = {
  Query: {
    overTimeList: OverTimeListResolver,
    overTime: OverTimeById,
  },
  Mutation: {
    createOverTime: CreateOTResolver,
    updateOverTime: UpdateOTResolver,
    updateOverTimeStatus: UpdateOTStatus,
  },
};
