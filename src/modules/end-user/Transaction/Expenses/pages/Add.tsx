import { useForm } from "react-hook-form";
import { IExpenses } from "../types/IExpenses";
import AddExpensesForm from "../component/AddExpenses";

interface Props {
  visible: boolean;
  onClose?: () => void;
  inset?: boolean;
}

const Add = ({ visible, onClose, inset }: Props) => {
  const form = useForm<IExpenses>({
    defaultValues: {
      transactionDate: "",
      totalAmount: 0,
      narration: "",
      transactionMode: 2,
      addTransactionsItemsForExpense: [
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
          : "inset-0  "
      }`}
    >
      <div
        className={` bg-white  ${
          inset ? " bg-white   w-[88%] h-full " : "bg-white w-full h-full"
        }`}
      >
        <AddExpensesForm form={form} onClose={handleFormClose} />
      </div>
    </div>
  );
};

export default Add;
