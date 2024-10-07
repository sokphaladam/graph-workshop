import { OrderBalanceSummaryResolver } from "./OrderBalanceSummaryResolver";
import { ReportStaffPayrollResolver } from "./ReportStaffPayrollResolver";
import { TopProductSellResolver } from "./TopProductSellResolver";

export const ReportResolver = {
  Query: {
    orderBalanceSummary: OrderBalanceSummaryResolver,
    topProductSell: TopProductSellResolver,
    reportStaffPayroll: ReportStaffPayrollResolver,
  },
};
