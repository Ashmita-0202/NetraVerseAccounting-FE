export interface IUserResponse {
  Id: string;
  UserName: string;
  Email: string;
  Password: string;
  rolesId: string[];
  InstitutionId: string;
  companyIds: string[];
}
export interface IAssign {
  userId: string;
  rolesId: string[];
}
export interface IFilterUserByDate {
  startDate: string;
  endDate: string;
  userName: string;
}
