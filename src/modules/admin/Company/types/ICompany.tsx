enum Status {
  Manual = 0,
  Automatic = 1,
}
export interface ICompany {
  id: string;
  name: string;
  address: string;
  email: string;
  shortName: string;
  contactNumber: string;
  contactPerson: string;
  pan: string;
  imageUrl: string;
  isEnable: boolean;
  isDeleted: boolean;
  institutionId: string;
  billNumberGenerationTypeForPurchase: Status;
  billNumberGenerationTypeForSales: Status;
}
export interface IFilterCompanyByDate {
  startDate: string;
  endDate: string;
  name: string;
}
