import { RouteObject } from "react-router-dom";
import AllPaymentMode from "../pages/All";
import AddPaymentMode from "../pages/Add";

const PaymentModeRoutes: RouteObject[] = [
  {
    path: "All-PaymentMode",
    element: <AllPaymentMode />,
  },
  {
    path: "AddPaymentMode",
    element: <AddPaymentMode visible />,
  },
];
export default PaymentModeRoutes;
