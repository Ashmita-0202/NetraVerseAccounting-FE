export interface IPurchaseReport {
  ledgerId: string;
  startDate: string;
  endDate: string;
}

export interface IPurchaseReportResponse {
  date: string;
  billNumber: string;
  accountId: string;
  type: string;
  totalAmount: string;
  companyId: string;
  purchaseRegisterItems: purchaseItems[];
}
export interface purchaseItems {
  itemId: string;
  amount: string;
}

export interface ISalesReport {
  ledgerId: string;
  startDate: string;
  endDate: string;
}
export interface ISalesReportResponse {
  date: string;
  billNumber: string;
  accountId: string;
  type: string;
  totalAmount: string;
  companyId: string;
  salesRegisterItems: salesItems[];
}
export interface salesItems {
  itemId: string;
  amount: string;
}

export interface IJournalReport {
  ledgerId: string;
  ledgerGroupId: string;
  startDate: string;
  endDate: string;
}
export interface IJournalReportResponse {
  id: string;
  journalEntryId: string;
  ledgerId: string;
  debitAmount: number;
  creditAmount: number;
  transactionDate: string;
  companyId: string;
  JournalRegisterItems: IJournalReport[];
}
