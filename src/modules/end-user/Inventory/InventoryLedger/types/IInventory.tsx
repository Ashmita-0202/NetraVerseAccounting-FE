export interface IInventory {
  id: string;
  itemId: string;
  entryDate?: string;
  remainingQuantity: number;
  averageAmountIn: number;
  averageAmountOut: number;
  itemNames: string;
  salesQuantity: number;
}

export interface IFilterInventoryByItem {
  itemId: string;
}

export interface IInventoryItem {
  itemId: string;
  entryDate: string;
  quantityOut: number;
  quantityIn: number;
  amountIn: number;
  amountOut: number;
  ledgerId: string;
  type: number;
  serialNumbers: [];
}

export interface IRemaining {
  ItemId: string;
  RemainingQuantity: string;
}
export interface IFilterInventoryLedgerByDate {
  startDate: string;
  endDate: string;
  itemId: string;
}
