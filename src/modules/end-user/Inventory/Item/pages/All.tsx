import TitleHeader from "@/components/common/TitleHeader";
import Add from "./Add";
import { useState, useEffect } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllItemForm from "../components/AllForm";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { useForm } from "react-hook-form";
import { IFilterItemByDate } from "../types/IItem";
const AllItem = () => {
  const [Item, setShowItem] = useState(false);
  const { menuStatus } = usePermissions();
  const navigate = useNavigate();
  useHotkeys(
    "alt+n",
    () => {
      setShowItem(true);
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  useEffect(() => {
    const context = menuStatus;
    if (!context) {
      navigate("/");
    }
  }, [navigate, menuStatus]);
  const { canAdd } = useMenuPermissionData(menuStatus);
  const buttonElement = () => {
    return (
      <div>
        {canAdd && (
          <div>
            <ButtonElement
              type="button"
              text="Add New"
              onClick={() => setShowItem(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  const ItemForm = useForm<IFilterItemByDate>();
  return (
    <div className="h-[98%] w-full ">
      <TitleHeader title="All Items" button={buttonElement()} />
      <AllItemForm form={ItemForm} />
      <div className="h-full">
        <Add
          inset
          visible={Item}
          onClose={() => setShowItem(false)}
          onItemAdded={() => {
            return;
          }}
        />
      </div>
    </div>
  );
};

export default AllItem;
