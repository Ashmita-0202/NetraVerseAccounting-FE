export interface IItemStatus {
  id?: string;
  isExpiredDate: boolean;
  isSerialNo: boolean;
}

export interface IInventoryStatus {
  inventoryMethod: number;
  companyId: string;
}
export interface IJournalStatus {
  journalReferences: number;
  companyId: string;
}
