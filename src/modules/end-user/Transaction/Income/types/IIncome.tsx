export interface IIncome {
  id?: string;
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId?: string;
  addTransactionItemsForIncome: ITransactionsItemsForIncome[];
}
export interface ITransactionsItemsForIncome {
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
