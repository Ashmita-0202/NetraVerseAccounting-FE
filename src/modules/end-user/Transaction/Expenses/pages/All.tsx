import TitleHeader from "@/components/common/TitleHeader";

import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllExpensesForm from "../component/AllExpenses";
import Add from "./Add";
import { useHotkeys } from "react-hotkeys-hook";
// import { usePermissions } from "@/context/auth/PermissionContext";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";

const AllExpenses = () => {
  const [showExpenses, setShowExpenses] = useState(false);
  // const { menuStatus } = usePermissions();
  // const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowExpenses(true);
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  const buttonElement = () => {
    return (
      <div>
        <div>
          <ButtonElement
            type="button"
            text="Add New"
            onClick={() => setShowExpenses(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="h-[98%]">
      <TitleHeader title="All Expenses" button={buttonElement()} />
      <AllExpensesForm />
      <div className="h-full">
        <Add
          visible={showExpenses}
          onClose={() => setShowExpenses(false)}
          inset
        />
      </div>
    </div>
  );
};
export default AllExpenses;
