import { RouteObject } from "react-router-dom";
import AllPayment from "../pages/All";
import Add from "../pages/Add";

const PaymentRoute: RouteObject[] = [
  {
    path: "All-Payment",
    element: <AllPayment />,
  },
  {
    path: "AddPayment",
    element: (
      <Add
        visible
        inset
        onUnitAdded={() => {
          return;
        }}
      />
    ),
  },
];
export default PaymentRoute;
