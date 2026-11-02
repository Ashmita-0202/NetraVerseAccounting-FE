import TitleHeader from "@/components/common/TitleHeader";
import AllCompanyForm from "../components/AllCompanyForm";
import Add from "./Add";
import { useState } from "react";
import { ButtonElement } from "@/components/FormComponents/Button";
const AllCompany = () => {
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
      <TitleHeader title="All Company" button={buttonElement()} />
      <AllCompanyForm />
      <Add visible={modal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AllCompany;
