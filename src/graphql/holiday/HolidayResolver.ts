import { CreateHolidayResolver } from "./CreateHolidayResolver";
import {
  HolidayByIDResolver,
  HolidayListResolver,
} from "./HolidayListResolver";
import { UpdateHolidayResolver } from "./UpdateHolidayResolver";

export const HolidayResolver = {
  Query: {
    holidayList: HolidayListResolver,
    holiday: HolidayByIDResolver,
  },
  Mutation: {
    createHoliday: CreateHolidayResolver,
    updateHoliday: UpdateHolidayResolver,
  },
};
