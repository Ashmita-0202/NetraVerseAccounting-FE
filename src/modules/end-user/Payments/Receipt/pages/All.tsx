import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllReceiptForm from "../components/AllReceiptForm";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import { useHotkeys } from "react-hotkeys-hook";
const AllReceipt = () => {
  const [Receipt, setShowReceipt] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowReceipt(true);
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
          <ButtonElement
            type="button"
            text="Add New"
            onClick={() => setShowReceipt(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Receipt" button={buttonElement()} />
      <AllReceiptForm />
      <Add visible={Receipt} onClose={() => setShowReceipt(false)} />
    </div>
  );
};
export default AllReceipt;
