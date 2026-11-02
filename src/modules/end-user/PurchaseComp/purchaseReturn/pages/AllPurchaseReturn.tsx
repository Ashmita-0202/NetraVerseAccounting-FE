import { useState } from "react";
import TitleHeader from "@/components/common/TitleHeader";
import AllPurchaseReturnForm from "../component/AllPurchaseReturnForm";
import Add from "./Add";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useHotkeys } from "react-hotkeys-hook";

const AllPurchase = () => {
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
      <TitleHeader title="Purchase Return" button={buttonElement()} />
      <AllPurchaseReturnForm />

      <Add visible={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
};

export default AllPurchase;
