export interface ILedgers {
  id: string;
  name: string;
  address?: string;
  panNo?: string;
  phoneNumber?: string;
  maxCreditPeriod?: string;
  maxDuePeriod?: string;
  ledgerGroupId: string;
}
export interface ILedgerBalance {
  ledgerId: string;
  balance: number;
}
export interface IFilterLedgerByDate {
  startDate: string;
  endDate: string;
  name: string;
}

export interface IFilteredLedger {
  id: string;
  name: string;
  ledgerGroupId: string;
}

export interface ILedgerGroup {
  id: string;
  name: string;
  isCustom: boolean;
  masterId: string;
  isPrimary: boolean;
}
