import { RouteObject } from "react-router-dom";
import { AllUsers } from "../pages/All";

const UserRoutes: RouteObject[] = [
  {
    path: "add-user",
    element: <h1>Add User</h1>,
  },
  {
    path: "all-users",
    element: <AllUsers />,
  },
];

export default UserRoutes;
