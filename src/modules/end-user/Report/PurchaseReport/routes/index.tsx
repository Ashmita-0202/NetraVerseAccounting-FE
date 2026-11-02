import { RouteObject } from "react-router-dom";
import AllPurchaseReport from "../pages/All";

const PurchaseReportRoute: RouteObject[] = [
  {
    path: "PurchaseReport",
    element: <AllPurchaseReport />,
  },
];
export default PurchaseReportRoute;
