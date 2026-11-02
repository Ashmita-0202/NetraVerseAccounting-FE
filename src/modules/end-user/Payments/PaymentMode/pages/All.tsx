import TitleHeader from "@/components/common/TitleHeader";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllPaymentModeForm from "../components/AllPaymentMode";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
// import { usePermissions } from "@/context/auth/PermissionContext";
import AddPaymentMode from "./Add";
const AllPaymentMode = () => {
  const [Receipt, setShowReceipt] = useState(false);
  // const { menuStatus } = usePermissions();
  // const { canAdd } = useMenuPermissionData(menuStatus);
  const buttonElement = () => {
    return (
      <div>
        {/* {canAdd && ( */}
        <ButtonElement
          type="button"
          text="Add New"
          onClick={() => setShowReceipt(true)}
          className="!text-xs font-bold !bg-teal-500"
        />
        {/* )} */}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Payment" button={buttonElement()} />
      <AllPaymentModeForm />
      <AddPaymentMode visible={Receipt} onClose={() => setShowReceipt(false)} />
    </div>
  );
};
export default AllPaymentMode;
