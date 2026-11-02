import { useNavigate } from "react-router-dom";
import { ButtonElement } from "./Button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const naviagate = useNavigate();
  return (
    <ButtonElement
      appearance="transparent"
      icon={<ArrowLeft />}
      text="Back"
      type="button"
      onClick={() => naviagate(-1)}
      className="hover:bg-gray-950 cursor-pointer items-center flex gap-1 bg-gray-800 px-4 py-2 rounded text-lg text-white"
    />
  );
};

export default BackButton;
