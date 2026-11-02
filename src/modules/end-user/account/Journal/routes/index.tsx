import { RouteObject } from "react-router-dom";
import AllJournal from "../pages/All";
import Add from "../pages/Add";

const JournalRoutes: RouteObject[] = [
  {
    path: "all-journal",
    element: <AllJournal />,
  },
  {
    path: "AddJournal",
    element: <Add visible inset />,
  },
];
export default JournalRoutes;
