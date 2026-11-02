import { useForm } from "react-hook-form";
import { ISales } from "../types/ISales";
import AddSalesForm from "../component/AddSalesForm";

interface Props {
  visible: boolean;
  inset?: boolean;
  onClose?: () => void;
}

const Add = ({ visible, onClose, inset = true }: Props) => {
  const form = useForm<ISales>({
    defaultValues: {
      date: null,
      billNumber: "",
      ledgerId: "",
      amountInWords: "",
      discountPercent: null,
      discountAmount: null,
      vatPercent: null,
      referenceNumber: null,
      vatAmount: null,
      salesItems: [
        {
          quantity: 0,
          unitId: "",
          itemId: "",
          price: 0,
          amount: "",
          serialNumbers: [],
        },
      ],
    },
  });

  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`w-full h-full flex z-50 ${
        inset ? "fixed inset-0 ml-[12%] bg-black bg-opacity-50 flex  z-50 " : ""
      }`}
    >
      <div
        className={` bg-white  ${
          inset ? " bg-white   w-[88%] h-full " : "w-full h-full"
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"></button>
        <AddSalesForm form={form} onClose={handleFormClose} />
      </div>
    </div>
  );
};

export default Add;
