export interface ILedgerGroups {
  id: string;
  name: string;
  isCustom: boolean;
  masterId: string;
  isPrimary: boolean;
}
export interface IFilterLedgerGroupByDate {
  startDate: string;
  endDate: string;
  name: string;
}
