import { RouteObject } from "react-router-dom";
import Settings from "../pages/Settings";

const SettingsRoute: RouteObject[] = [
  {
    path: "settings",
    element: <Settings />,
  },
];
export default SettingsRoute;
