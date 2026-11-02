export interface IItemGroup {
  id: string;
  name: string;
  description: string | null;
  isPrimary: boolean;
  itemGroupId?: string;
}

export interface IFilterItemGroupByDate {
  startDate: string;
  endDate: string;
  name: string;
}
