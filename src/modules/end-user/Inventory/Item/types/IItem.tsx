export interface IItem {
  id: string;
  name: string;
  price?: number | null;
  itemGroupId: string;
  unitId: string;
  sellingPrice?: string | null;
  costPrice?: string | null;
  barCodeField?: string | null;
  expiredDate?: string | null;
  openingStockQuantity?: number | null;
  serialNumbers?: string[] | null;
  hsCode?: string | null;
  entryDate?: string | null;
  minimumLevel?: number | null;
  serialNumberCheckbox?: boolean;
  hasConversionFactor?: boolean;
  ExpiryCheckbox?: string;
  conversionFactorId?: string | null;
  serialNumber?: string[] | null;
  hasSerial?: boolean;
}
export interface IFilterItemByDate {
  startDate: string;
  endDate: string;
  name: string;
}
