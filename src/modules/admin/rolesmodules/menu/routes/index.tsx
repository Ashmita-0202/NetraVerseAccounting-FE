import { RouteObject } from "react-router-dom";
import All from "../pages/All";

const MenuRoutes: RouteObject[] = [
  {
    path: "all-menus",
    element: <All />,
  },
];

export default MenuRoutes;
