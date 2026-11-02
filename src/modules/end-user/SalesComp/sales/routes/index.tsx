import { RouteObject } from "react-router-dom";
import AllSales from "../pages/All";
import Add from "../pages/Add";
const SalesRoute: RouteObject[] = [
  {
    path: "All-Sales",
    element: <AllSales />,
  },
  {
    path: "addSales",
    element: <Add visible inset={false} />,
  },
];
export default SalesRoute;
