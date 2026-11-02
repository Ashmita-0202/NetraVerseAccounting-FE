import { useState } from "react";
import TitleHeader from "@/components/common/TitleHeader";
import AllSalesReturnForm from "../component/AllSalesReturnForm";
import Add from "./Add";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useHotkeys } from "react-hotkeys-hook";

const AllSales = () => {
  const [showFilter, setShowFilter] = useState(false);
  useHotkeys(
    "alt+n",
    () => {
      setShowFilter(true);
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  const buttonElement = () => {
    return (
      <div>
        <ButtonElement
          type="button"
          text="Add New"
          onClick={() => setShowFilter(true)}
          className="!text-xs font-bold !bg-teal-500"
        />
      </div>
    );
  };

  return (
    <div>
      <TitleHeader title="Sales Return" button={buttonElement()} />
      <AllSalesReturnForm />

      <Add visible={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
};

export default AllSales;
