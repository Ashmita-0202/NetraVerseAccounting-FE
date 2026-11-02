import { RouteObject } from "react-router-dom";
import AllReceipt from "../pages/All";
import Add from "../pages/Add";

const ReceiptRoutes: RouteObject[] = [
  {
    path: "all-Receipt",
    element: <AllReceipt />,
  },
  {
    path: "AddReceipt",
    element: <Add visible />,
  },
];
export default ReceiptRoutes;
