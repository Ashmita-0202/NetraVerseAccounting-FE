import { RouteObject } from "react-router-dom";
import AllDashboard from "../pages/All";
const DashboardRoutes: RouteObject[] = [
  {
    path: "",
    element: <AllDashboard />,
  },
];

export default DashboardRoutes;
