import { RouteObject } from "react-router-dom";
import AllIncomes from "../pages/All";
import Add from "../pages/Add";
const IncomesRoute: RouteObject[] = [
  {
    path: "All-Income",
    element: <AllIncomes />,
  },
  {
    path: "AddIncome",
    element: <Add visible inset />,
  },
];
export default IncomesRoute;
