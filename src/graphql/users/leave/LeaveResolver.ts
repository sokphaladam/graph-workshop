import { CreateLeaveResolver } from "./CreateLeaveResolver";
import { LeaveById, LeaveListResolver } from "./LeaveListResolver";
import { UpdateLeaveResolver } from "./UpdateLeaveResolver";
import { UpdateLeaveStatus } from "./UpdateLeaveStatus";

export const LeaveResolver = {
  Query: {
    leaveList: LeaveListResolver,
    leave: LeaveById,
  },
  Mutation: {
    createLeave: CreateLeaveResolver,
    updateLeave: UpdateLeaveResolver,
    updateLeaveStatus: UpdateLeaveStatus,
  },
};
