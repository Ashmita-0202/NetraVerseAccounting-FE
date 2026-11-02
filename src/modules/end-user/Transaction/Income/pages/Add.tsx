import { useForm } from "react-hook-form";
import { IIncome } from "../types/IIncome";
import AddIncomeForm from "../component/AddIncomeForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
  inset?: boolean;
}

const Add = ({ visible, onClose, inset }: Props) => {
  const form = useForm<IIncome>({
    defaultValues: {
      transactionDate: "",
      totalAmount: 0,
      narration: "",
      transactionMode: 1,
      paymentId: "",
      addTransactionItemsForIncome: [
        {
          amount: 0,
          remarks: "",
          ledgerId: "",
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
        inset
          ? "fixed inset-0 ml-[12%] bg-black bg-opacity-50 flex  z-50 "
          : "inset-0  mt-[-21%]"
      }`}
    >
      <div
        className={` bg-white  ${
          inset ? " bg-white   w-[88%] h-full " : "w-full h-full"
        }`}
      >
        <button
          onClick={handleFormClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        ></button>
        <AddIncomeForm form={form} onClose={handleFormClose} />
      </div>
    </div>
  );
};

export default Add;
