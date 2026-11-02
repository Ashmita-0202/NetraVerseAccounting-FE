import { useState } from "react";
import TitleHeader from "@/components/common/TitleHeader";
import AllUserForm from "../components/AllUserForm";
import Add from "./Add";
import { ButtonElement } from "@/components/FormComponents/Button";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "../../rolesmodules/hooks/useMenuPermissionData";

export const AllUsers = () => {
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const [modal, setShowModal] = useState(false);
  const buttonElement = () => (
    <div>
      {canAdd && (
        <ButtonElement
          type="button"
          text="Add New"
          onClick={() => setShowModal(true)}
          className="!text-xs font-bold !bg-teal-500"
        />
      )}
    </div>
  );

  return (
    <>
      <TitleHeader title="All Users" button={buttonElement()} />
      <AllUserForm />
      <Add visible={modal} onClose={() => setShowModal(false)} />
    </>
  );
};
