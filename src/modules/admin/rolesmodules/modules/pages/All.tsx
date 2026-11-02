import TitleHeader from "@/components/common/TitleHeader";
import AllModuleForm from "../components/AllModuleForm";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
const AllModules = () => {
  const [modal, setShowModal] = useState(false);

  const buttonElement = () => {
    return (
      <ButtonElement
        type="button"
        text="Add New"
        onClick={() => setShowModal(true)}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  return (
    <div>
      <TitleHeader title="All Modules" button={buttonElement()} />
      <AllModuleForm />
      <Add visible={modal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AllModules;
