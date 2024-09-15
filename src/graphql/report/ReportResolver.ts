import { OrderBalanceSummaryResolver } from "./OrderBalanceSummaryResolver";

export const ReportResolver = {
  Query: {
    orderBalanceSummary: OrderBalanceSummaryResolver,
  },
};
