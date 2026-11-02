import { useForm } from "react-hook-form";
import { ISalesReturn } from "../types/ISalesReturn";
import AddSalesReturnForm from "../component/AddSalesReturn";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedSalesDetailsId?: string;
}

const AddSalesReturn = ({
  visible,
  onClose,
  selectedSalesDetailsId,
}: Props) => {
  const form = useForm<ISalesReturn>();
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Add Sales Return</h2>
        <AddSalesReturnForm
          form={form}
          onClose={onClose}
          selectedSalesDetailsId={selectedSalesDetailsId}
        />
      </div>
    </div>
  );
};

export default AddSalesReturn;
