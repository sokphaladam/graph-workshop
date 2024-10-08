import { OrderBalanceSummaryResolver } from "./OrderBalanceSummaryResolver";
import { ReportSaleByDayResolver } from "./ReportSaleByDayResolver";
import { ReportStaffPayrollResolver } from "./ReportStaffPayrollResolver";
import { TopProductSellResolver } from "./TopProductSellResolver";

export const ReportResolver = {
  Query: {
    orderBalanceSummary: OrderBalanceSummaryResolver,
    topProductSell: TopProductSellResolver,
    reportStaffPayroll: ReportStaffPayrollResolver,
    reportSaleByDay: ReportSaleByDayResolver,
  },
};
