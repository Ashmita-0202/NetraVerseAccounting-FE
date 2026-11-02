export interface IVatDetails {
  type: string;
  ledgerId: string;
  vatInWards?: number;
  vatOutWards?: number;
  billNumbers: string;
}
export interface IFilterLedgerBalance {
  startDate: string;
  endDate: string;
  ledgerId: string;
}
