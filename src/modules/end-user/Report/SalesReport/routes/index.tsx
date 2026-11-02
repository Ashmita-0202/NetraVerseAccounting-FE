import { RouteObject } from "react-router-dom";
import AllSalesReport from "../pages/All";

const SalesReportRoute: RouteObject[] = [
  {
    path: "SalesReport",
    element: <AllSalesReport />,
  },
];
export default SalesReportRoute;
