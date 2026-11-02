import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllJournalForm from "../components/AllJournal";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
const AllJournal = () => {
  const [journal, setShowJournal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const buttonElement = () => {
    return (
      <div>
        {canAdd && (
          <ButtonElement
            type="button"
            text="Add New"
            onClick={() => setShowJournal(true)}
            className="!text-xs font-bold !bg-teal-500"
          />
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Journal" button={buttonElement()} />
      <AllJournalForm />
      <Add visible={journal} onClose={() => setShowJournal(false)} />
    </div>
  );
};
export default AllJournal;
