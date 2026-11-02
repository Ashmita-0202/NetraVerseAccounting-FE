export interface ISalesReport {
  InvoiceNo: string;
  PartyId: string;
  ItemId: string;
  Quantity: number;
  UnitPrice: number;
  ReturnedQty: number;
  TaxRate: number;
  DiscountRate: number;
}

export interface ISalesFilter {
  InvoiceNumber: string;
  PartyId: string;
  SerialNumber: string[];
  ItemId: string;
}
