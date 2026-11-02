import { useForm } from "react-hook-form";
import { IPurchaseReturn } from "../types/IPurchaseReturn";
import AddPurchaseReturnForm from "../component/AddPurchaseReturn";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedPurchaseDetailsId?: string;
}

const AddPurchaseReturn = ({
  visible,
  onClose,
  selectedPurchaseDetailsId,
}: Props) => {
  const form = useForm<IPurchaseReturn>();
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
        <h2 className="text-lg font-bold mb-4">Add Purchase Return</h2>
        <AddPurchaseReturnForm
          form={form}
          onClose={onClose}
          selectedPurchaseDetailsId={selectedPurchaseDetailsId}
        />
      </div>
    </div>
  );
};

export default AddPurchaseReturn;
