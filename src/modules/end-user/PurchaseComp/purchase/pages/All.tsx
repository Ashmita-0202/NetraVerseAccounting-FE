import TitleHeader from "@/components/common/TitleHeader";

import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllPurchaseForm from "../component/Allpurchasedetails";
import Add from "./Add";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useHotkeys } from "react-hotkeys-hook";

const AllPurchase = () => {
  const [showPurchase, setShowPurchase] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowPurchase(true);
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
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
              onClick={() => setShowPurchase(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Purchase" button={buttonElement()} />
      <AllPurchaseForm />
      <Add visible={showPurchase} onClose={() => setShowPurchase(false)} />
    </div>
  );
};
export default AllPurchase;
