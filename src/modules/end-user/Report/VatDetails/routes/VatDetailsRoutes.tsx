import { RouteObject } from "react-router-dom";
import AllVatDetails from "../pages/AllVatDetails";

const VatDetailsRoute: RouteObject[] = [
  {
    path: "VatDetails",
    element: <AllVatDetails />,
  },
];
export default VatDetailsRoute;
