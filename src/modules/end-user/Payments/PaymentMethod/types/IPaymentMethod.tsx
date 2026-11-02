export interface IPaymentMethod {
  id: string;
  name: string;
  ledgerGroupId: string;
  type: number;
}

export interface IFilterPaymentMethodByDate {
  startDate: string;
  endDate: string;
  name: string;
}
