export interface IConversionFactor {
  id?: string;
  name: string;
  fromUnit: string;
  toUnit: string;
  conversionFactor: number | null;
}

export interface IFilterConversionFactorByDate {
  startDate: string;
  endDate: string;
  formUnit: string;
}
