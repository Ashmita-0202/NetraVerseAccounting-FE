import { RouteObject } from "react-router-dom";
import AllItem from "../pages/All";
import AddItem from "../pages/Add";

const ItemRoute: RouteObject[] = [
  {
    path: "all-Item",
    element: <AllItem />,
  },
  {
    path: "AddItem",
    element: (
      <AddItem
        visible
        inset
        onItemAdded={() => {
          return;
        }}
      />
    ),
  },
];
export default ItemRoute;
