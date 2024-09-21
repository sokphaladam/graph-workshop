import { OrderBalanceSummaryResolver } from "./OrderBalanceSummaryResolver";
import { TopProductSellResolver } from "./TopProductSellResolver";

export const ReportResolver = {
  Query: {
    orderBalanceSummary: OrderBalanceSummaryResolver,
    topProductSell: TopProductSellResolver,
  },
};
