import { RouteObject } from "react-router-dom";
import AllLedgerBalance from "../pages/AllLedgerBalance";

const LedgerBalanceRoute: RouteObject[] = [
  {
    path: "BalanceReport",
    element: <AllLedgerBalance />,
  },
];
export default LedgerBalanceRoute;
