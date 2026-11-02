import { RouteObject } from "react-router-dom";
import AllPurchase from "../pages/All";
import Add from "../pages/Add";
const PurchaseRoute: RouteObject[] = [
  {
    path: "All-PurchaseList",
    element: <AllPurchase />,
  },
  {
    path: "AddPurchase",
    element: <Add visible={true} inset={false} />,
  },
];
export default PurchaseRoute;
