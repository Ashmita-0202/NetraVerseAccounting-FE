import { ButtonElement } from "@/components/FormComponents/Button";
import { useNavigate } from "react-router-dom";
type Props = {};

const ErrorPage = ({}: Props) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <h1 className="text-9xl font-extrabold">माफ गर्नुहोस्</h1>
        <ButtonElement
          text="Go back"
          type="button"
          onClick={() => navigate(-1)}
          className="hover:bg-gray-950 cursor-pointer items-center flex gap-1 bg-gray-800 px-4 py-2 rounded text-lg text-white"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
