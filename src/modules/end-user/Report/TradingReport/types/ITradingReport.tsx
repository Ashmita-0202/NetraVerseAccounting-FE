export interface ITradingReport {
  IncomeGroups: ILedgerGroupLevels[];
  ExpenseGroups: ILedgerGroupLevels[];
}
export interface ILedgerGroupLevels {
  LedgerGroupId: string;
  GroupTotal: number;
  LedgerItems: ILedgerLevels[];
}
interface ILedgerLevels {
  LedgerId: string;
  LedgerName: string;
  Balance: number;
}

export interface IFilterTradingReport {
  fromDate: string;
  toDate: string;
}
