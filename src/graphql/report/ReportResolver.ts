import { OrderBalanceSummaryResolver } from "./OrderBalanceSummaryResolver";
import { ReportSaleBreakDownResolver } from "./ReportSaleBreakDownResolver";
import { ReportSaleByDayResolver } from "./ReportSaleByDayResolver";
import { ReportSaleProductResolver } from "./ReportSaleProductResolver";
import { ReportStaffPayrollResolver } from "./ReportStaffPayrollResolver";
import { TopProductSellResolver } from "./TopProductSellResolver";

export const ReportResolver = {
  Query: {
    orderBalanceSummary: OrderBalanceSummaryResolver,
    topProductSell: TopProductSellResolver,
    reportStaffPayroll: ReportStaffPayrollResolver,
    reportSaleByDay: ReportSaleByDayResolver,
    reportSaleProduct: ReportSaleProductResolver,
    reportSaleBreakDown: ReportSaleBreakDownResolver,
  },
};
