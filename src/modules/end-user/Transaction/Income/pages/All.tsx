import TitleHeader from "@/components/common/TitleHeader";

import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllIncomeForm from "../component/AllIncomeForm";
import Add from "./Add";
import { useHotkeys } from "react-hotkeys-hook";
// import { usePermissions } from "@/context/auth/PermissionContext";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";

const AllIncome = () => {
  const [showIncome, setShowIncome] = useState(false);
  // const { menuStatus } = usePermissions();
  // const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowIncome(true);
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
            onClick={() => setShowIncome(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="h-[98%]">
      <TitleHeader title="All Income" button={buttonElement()} />
      <AllIncomeForm />
      <div className="h-full">
        <Add visible={showIncome} onClose={() => setShowIncome(false)} inset />
      </div>
    </div>
  );
};
export default AllIncome;
