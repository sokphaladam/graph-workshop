import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { CreateTransactionStockResolver } from "./CreateTransactionStockResolver";
import SetItemShowResolver from "./SetItemShowResolver";
import { TransactionStockListResolver } from "./TransactionStockListResolver";

export const StockResolver = {
  Mutation: {
    setItemShowOn: SetItemShowResolver,
    createTransactionStock: CreateTransactionStockResolver,
  },
  Query: {
    transactionStockList: TransactionStockListResolver,
  },
};
