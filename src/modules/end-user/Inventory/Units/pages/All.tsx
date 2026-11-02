import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllUnitsForm from "../components/AllUnitsForm";

import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useHotkeys } from "react-hotkeys-hook";
const AllUnits = () => {
  const [Units, setShowUnits] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt + n",
    () => {
      setShowUnits(true);
    },
    {
      preventDefault: true,
    }
  );
  const buttonElement = () => {
    return (
      <div>
        {canAdd && (
          <div>
            <ButtonElement
              type="button"
              text="Add New"
              onClick={() => setShowUnits(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      {" "}
      <TitleHeader title="All Units" button={buttonElement()} />{" "}
      <AllUnitsForm />{" "}
      <Add
        visible={Units}
        onClose={() => setShowUnits(false)}
        onUnitAdded={() => {
          return;
        }}
      />{" "}
    </div>
  );
};
export default AllUnits;
