import { RouteObject } from "react-router-dom";
import AllExpenses from "../pages/All";
import Add from "../pages/Add";
const ExpensesRoute: RouteObject[] = [
  {
    path: "All-Expense",
    element: <AllExpenses />,
  },
  {
    path: "AddExpense",
    element: <Add visible inset />,
  },
];
export default ExpensesRoute;
