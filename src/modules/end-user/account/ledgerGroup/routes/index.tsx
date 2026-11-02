import { RouteObject } from "react-router-dom";
import AllLedgerGroup from "../pages/All";

const LedgerGroupRoute: RouteObject[] = [
  {
    path: "all-ledgerGroup",
    element: <AllLedgerGroup />,
  },
];
export default LedgerGroupRoute;
