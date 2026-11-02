import { RouteObject } from "react-router-dom";
import AllUnits from "../pages/All";
import Add from "../pages/Add";

const UnitsRoute: RouteObject[] = [
  {
    path: "all-Units",
    element: <AllUnits />,
  },
  {
    path: "AddUnit",
    element: (
      <Add
        visible
        inset
        onUnitAdded={() => {
          return;
        }}
      />
    ),
  },
];
export default UnitsRoute;
