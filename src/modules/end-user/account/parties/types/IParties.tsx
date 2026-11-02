export interface IParties {
  id: string;
  name: string;
  address?: string;
  panNo?: string;
  phoneNumber?: string;
  maxCreditPeriod?: string;
  maxDuePeriod?: string;
  ledgerGroupId: string;
}
export interface IFilterPartiesByDate {
  startDate: string;
  endDate: string;
  name: string;
}
