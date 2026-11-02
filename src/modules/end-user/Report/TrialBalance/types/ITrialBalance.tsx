export interface ITrialBalance {
  masterId: string;
  debitAmount: number;
  creditAmount: number;
  ledgerGroupLevels: ILedgerGroupLevels[];
}
interface ILedgerGroupLevels {
  ledgerGroupId: string;
  debitAmount: number;
  creditAmount: number;
  ledgersLevels: ILedgerLevels[];
}
interface ILedgerLevels {
  ledgerId: string;
  creditAmount: number;
  debitAmount: number;
}
