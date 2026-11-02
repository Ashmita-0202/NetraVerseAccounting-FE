import { RouteObject } from "react-router-dom";
import AllBalanceSheet from "../pages/AllBalanceSheet";

const BalanceSheetRoute: RouteObject[] = [
  {
    path: "BalanceSheet",
    element: <AllBalanceSheet />,
  },
];
export default BalanceSheetRoute;
