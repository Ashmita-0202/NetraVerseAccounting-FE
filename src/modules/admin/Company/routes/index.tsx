import { RouteObject } from "react-router-dom";
import AllCompany from "../pages/All";

const CompanyRoutes: RouteObject[] = [
  {
    path: "all-company",
    element: <AllCompany />,
  },
];

export default CompanyRoutes;
