export interface IPurchaseReturn {
  id: string;
  purchaseDetailsId: string;
  returnDate: string;
  totalReturnAmount: number;
  taxAdjustment: number;
  discount?: number;
  netReturnAmount: number;
  reason: string;
  ledgerId?: string;
  totalQuantity?: number;
  paymentId: string;
  PurchaseReturnItems: IPurchaseReturnItems[];
}

export interface IPurchaseReturnItems {
  // id: string;
  purchaseItemsId: string;
  returnQuantity: number;
  returnUnitPrice: number;
  returnTotalAmount: number;
  itemsId: string;
}
