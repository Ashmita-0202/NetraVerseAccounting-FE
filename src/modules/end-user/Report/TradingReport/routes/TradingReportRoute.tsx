import { RouteObject } from "react-router-dom";
import AllTradingReport from "../pages/AllTradingReport";

const TradingReportRoute: RouteObject[] = [
  {
    path: "TradingReport",
    element: <AllTradingReport />,
  },
];
export default TradingReportRoute;
