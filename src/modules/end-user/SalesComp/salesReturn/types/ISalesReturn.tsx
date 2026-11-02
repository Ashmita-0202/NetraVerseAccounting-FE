export interface ISalesReturn {
  id: string;
  salesDetailsId: string;
  returnDate: string;
  totalReturnAmount: number;
  taxAdjustment: number;
  discount?: number;
  netReturnAmount: number;
  reason: string;
  ledgerId?: string;
  totalQuantity?: number;
  paymentId: string;
  SalesReturnItems: ISalesReturnItems[];
}

export interface ISalesReturnItems {
  // id: string;
  salesItemsId: string;
  itemsId: string;
  returnQuantity: number;
  returnUnitPrice: number;
  returnTotalAmount: number;
}
