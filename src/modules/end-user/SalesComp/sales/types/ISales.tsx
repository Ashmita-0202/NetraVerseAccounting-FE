export interface ISales {
  id: string;
  date: string | null;
  billNumber: string;
  ledgerId: string;
  amountInWords: string;
  discountPercent: string | null;
  discountAmount: string | null;
  vatPercent: string | null;
  vatAmount: string | null;
  grandTotalAmount: string;
  paymentId: string;
  salesStatus?: number;
  referenceNumber?: string | null;
  totalQuantity?: number;
  salesItems: ISalesItems[];
}

export interface ISalesItems {
  id?: string;
  hscode?: string;
  quantity: number;
  unitId: string;
  itemId: string;
  price: number;
  amount: string;
  serialNumbers?: string[];
}

export interface IBillNumberGenerationForSales {
  id?: string;
  BillNumberGenerationType: 0;
}
export interface IFilterSalesByDate {
  startDate: string;
  endDate: string;
  ledgerId: string;
}

export interface ISalesDetailsItems {
  unitId: string;
  totalQuantity: number;
  rate: number;
  serialNumbers: string[];
}

export interface IReferenceGenerationForSales {
  id?: string;
  showReferenceNumberForSales: boolean;
}

export interface ITaxForSales {
  companyId?: string;
  showTaxInSales: boolean;
}
