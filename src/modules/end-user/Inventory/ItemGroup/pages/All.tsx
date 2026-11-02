import TitleHeader from "@/components/common/TitleHeader";
import AddItemGroup from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllItemGroupForm from "../components/AllForm";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useHotkeys } from "react-hotkeys-hook";

const AllItemGroup = () => {
  const [ItemGroup, setShowItemGroup] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  useHotkeys(
    "alt + n",
    () => {
      setShowItemGroup(true);
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
              onClick={() => setShowItemGroup(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Item Group" button={buttonElement()} />
      <AllItemGroupForm />
      <AddItemGroup
        visible={ItemGroup}
        onClose={() => setShowItemGroup(false)}
      />
    </div>
  );
};

export default AllItemGroup;
