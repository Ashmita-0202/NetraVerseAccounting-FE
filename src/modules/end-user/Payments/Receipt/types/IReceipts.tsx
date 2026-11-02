export interface IReceipts {
  id: string;
  narration: string;
  transactionMode: number;
  transactionDate: string;
  totalAmount: number;
  paymentId: string;
  transactionItemsForReceipts: AddReceiptEntryDetail[];
}
export interface IFilterReceiptByDate {
  startDate: string;
  endDate: string;
  description?: string;
}
export interface AddReceiptEntryDetail {
  amount: number;
  remarks: string;
  id?: string;
  ledgerId: string;
}

// export interface IUpdateReceipt {
//   referenceNumber: string;
//   transactionDate: string;
//   description: string;
//   UpdateReceiptEntryDetails: [
//     {
//       id?: string;
//       ledgerId: string;
//       debitAmount: number;
//       creditAmount: number;
//     }
//   ];
// }
