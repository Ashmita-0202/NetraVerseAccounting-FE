import { RouteObject } from "react-router-dom";
import SalesReportRegisterPage from "../pages/SalesReportRegisterPage";
import PurchaseReportRegisterPage from "../pages/PurchaseReportRegisterPage";
import JournalReportRegisterPage from "../pages/JournalReportRegisterPage";
import AllAccountBook from "../pages/All";

const ReportRoute: RouteObject[] = [
  {
    path: "SalesRegister",
    element: <SalesReportRegisterPage />,
  },
  {
    path: "PurchaseRegister",
    element: <PurchaseReportRegisterPage />,
  },
  {
    path: "JournalReport",
    element: <JournalReportRegisterPage />,
  },
  {
    path: "AccountBook",
    element: <AllAccountBook />,
  },
];
export default ReportRoute;
