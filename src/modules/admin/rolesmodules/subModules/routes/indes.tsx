import { RouteObject } from "react-router-dom";
import AllSubModules from "../pages/All";

const SubmodulesRoutes: RouteObject[] = [
  {
    path: "all-submodules",
    element: <AllSubModules />,
  },
];

export default SubmodulesRoutes;
