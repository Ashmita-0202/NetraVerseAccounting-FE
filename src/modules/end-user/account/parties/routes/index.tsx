import { RouteObject } from "react-router-dom";
import AllParties from "../pages/All";

const PartiesRoute: RouteObject[] = [
  {
    path: "all-parties",
    element: <AllParties />,
  },
];
export default PartiesRoute;
