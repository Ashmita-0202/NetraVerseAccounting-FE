import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllPaymentForm from "../components/AllPaymentMethodForm";
import { useHotkeys } from "react-hotkeys-hook";

// import { usePermissions } from "@/context/auth/PermissionContext";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
const AllPaymentMethod = () => {
  const [Payment, setShowPayment] = useState(false);
  // const { menuStatus } = usePermissions();
  // const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowPayment(true);
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  const buttonElement = () => {
    return (
      <div>
        {/* {canAdd && ( */}
        <div>
          <ButtonElement
            type="button"
            text="Add New"
            onClick={() => setShowPayment(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        </div>
        {/* )} */}
      </div>
    );
  };
  return (
    <div>
      {" "}
      <TitleHeader title="All Payment" button={buttonElement()} />{" "}
      <AllPaymentForm />{" "}
      <Add
        visible={Payment}
        onClose={() => setShowPayment(false)}
        onUnitAdded={() => {
          return;
        }}
      />{" "}
    </div>
  );
};
export default AllPaymentMethod;
