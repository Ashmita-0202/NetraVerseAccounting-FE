import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllLedgerForm from "../components/AllLedger";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import { useHotkeys } from "react-hotkeys-hook";

const AllLedger = () => {
  const [ledger, setShowLedger] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt+n",
    () => {
      setShowLedger(true);
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
            onClick={() => setShowLedger(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Ledger" button={buttonElement()} />
      <Add
        visible={ledger}
        onClose={() => setShowLedger(false)}
        onLedgerAdded={() => {
          return;
        }}
      />
      <AllLedgerForm />
    </div>
  );
};

export default AllLedger;
