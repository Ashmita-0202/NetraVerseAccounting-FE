export interface IBalanceSheet {
  masterId: string;
  balance: number;
  LedgerGroupLevelBalanceSheetResponses: ILedgerGroupLevels[];
}
export interface ILedgerGroupLevels {
  ledgerGroupId: string;
  balance: number;
  LedgerLevelBalanceSheetResponses: ILedgerLevels[];
}
export interface ILedgerLevels {
  ledgerId: string;
  balance: number;
}

export interface IFilterBalanceSheet {
  startDate: string;
  endDate: string;
  ledgerId: string;
}
