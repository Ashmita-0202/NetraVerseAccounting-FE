export interface IExpenses {
  id?: string;
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId?: string;
  addTransactionsItemsForExpense: ITransactionsItemsForExpense[];
}
export interface ITransactionsItemsForExpense {
  id?: string;
  amount: number;
  remarks: string;
  ledgerId: string;
}
export interface IFilterExpensesByDate {
  startDate: string;
  endDate: string;
  ledgerId: string;
}

export interface IVoucher {
  Id?: string;
  TransactionDate: string;
  TotalAmount: number;
  TransactionMode: number;
  PaymentId?: string;
  TransactionItems: ITransactionVoucher[];
}
export interface ITransactionVoucher {
  id?: string;
  amount: number;
  remarks: string;
  ledgerId: string;
  debitAmount?: number;
  creditAmount?: number;
}
