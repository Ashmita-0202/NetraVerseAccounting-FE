import { RouteObject } from "react-router-dom";
import AllLedger from "../pages/All";
import AddL from "../pages/Add";

const LedgerRoute: RouteObject[] = [
  {
    path: "all-ledger",
    element: <AllLedger />,
  },
  {
    path: "AddLedger",
    element: (
      <AddL
        visible
        inset
        onLedgerAdded={() => {
          return;
        }}
      />
    ),
  },
];
export default LedgerRoute;
