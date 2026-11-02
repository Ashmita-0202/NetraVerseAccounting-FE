export interface IFilterLedgerBalance {
  startDate: string;
  endDate: string;
  ledgerId: string;
}

export interface ILedgerBalance {
  ledgerId: string;
  balance: number;
}

export interface ILedgerSummary {
  JournalEntryId: string;
  ledgerId: string;
  debitAmount: string;
  creditAmout: string;
}
