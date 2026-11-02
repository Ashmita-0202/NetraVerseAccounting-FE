import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllConversionFactorForm from "../components/AllConversionFactor";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useHotkeys } from "react-hotkeys-hook";

const AllConversionFactor = () => {
  const [ConversionFactor, setShowConversionFactor] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt + n",
    () => {
      setShowConversionFactor(true);
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
              onClick={() => setShowConversionFactor(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Conversion Factor" button={buttonElement()} />
      <AllConversionFactorForm />
      <Add
        visible={ConversionFactor}
        onClose={() => setShowConversionFactor(false)}
      />
    </div>
  );
};

export default AllConversionFactor;
