import TitleHeader from "@/components/common/TitleHeader";

import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import AllSalesForm from "../component/AllSalesForm";
import Add from "./Add";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";

const AllSales = () => {
  const [showSales, setShowSales] = useState(false);
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
              onClick={() => setShowSales(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <TitleHeader title="All Sales" button={buttonElement()} />
      <AllSalesForm />
      <Add visible={showSales} onClose={() => setShowSales(false)} />
    </div>
  );
};
export default AllSales;
