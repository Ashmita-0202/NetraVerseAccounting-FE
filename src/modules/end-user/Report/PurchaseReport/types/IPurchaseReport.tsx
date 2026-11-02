export interface IPurchaseReport {
  InvoiceNo: string;
  PartyId: string;
  ItemId: string;
  Quantity: number;
  UnitPrice: number;
  ReturnedQty: number;
  TaxRate: number;
  DiscountRate: number;
}

export interface IPurchaseFilter {
  InvoiceNumber: string;
  PartyId: string;
  ItemId: string;
  SerialNumber: string[];
}
