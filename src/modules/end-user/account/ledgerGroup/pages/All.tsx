import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllLedgerGroupForm from "../components/AllLedgerGroupForm";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";

const AllLedgerGroup = () => {
  const [LedgerGroup, setShowLedgerGroup] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const buttonElement = () => {
    return (
      <div>
        {canAdd && (
          <div>
            <ButtonElement
              type="button"
              text="Add New"
              onClick={() => setShowLedgerGroup(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Ledger Group" button={buttonElement()} />
      <AllLedgerGroupForm />
      <Add visible={LedgerGroup} onClose={() => setShowLedgerGroup(false)} />
    </div>
  );
};

export default AllLedgerGroup;
