export interface IPurchase {
  id: string;
  date: string | null;
  billNumber: string | null;
  ledgerId: string;
  amountInWords: string;
  discountPercent: string | null;
  discountAmount: string | null;
  vatPercent: string | null;
  vatAmount: string | null;
  grandTotalAmount: number | null;
  referenceNumber: string;
  paymentId: string;
  status?: number;
  totalQuantity?: number;
  PurchaseItems: IPurchaseItems[];
}

export interface IPurchaseItems {
  id?: string;
  quantity: number;
  unitId: string;
  itemId: string;
  price: number;
  amount: number;
  serialNumbers?: string[];
}
export interface IFilterPurchaseByDate {
  startDate: string;
  endDate: string;
  ledgerId: string;
}

export interface IBillNumberGeneration {
  id?: string;
  BillNumberGenerationType: 0;
}
export interface IReferenceGenerationForPurchase {
  id?: string;
  showReferenceNumberForPurchase: boolean;
}

export interface ITaxForPurchase {
  companyId?: string;
  showTaxInPurchase: boolean;
}
