export interface IPaymentModes {
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId: string;
  addTransactionItemsForPayments: AddPaymentModeEntryDetail[];
}
export interface AddPaymentModeEntryDetail {
  amount: number;
  remarks: string;
  ledgerId: string;
}
export interface IFilterPaymentModeByDate {
  startDate: string;
  endDate: string;
  description?: string;
}
