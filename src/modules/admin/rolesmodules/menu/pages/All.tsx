import TitleHeader from "@/components/common/TitleHeader";
import AllMenuForm from "../components/AllMenuForm";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
import Add from "./Add";

const All = () => {
  const [modal, setShowModalForAdd] = useState(false);
  const buttonElement = () => {
    return (
      <ButtonElement
        type="button"
        text="Add New"
        onClick={() => setShowModalForAdd(true)}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  return (
    <div>
      <TitleHeader title="Menu" button={buttonElement()} />
      <AllMenuForm />
      <Add visible={modal} onClose={() => setShowModalForAdd(false)} />
    </div>
  );
};

export default All;
