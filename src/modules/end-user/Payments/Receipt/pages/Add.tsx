import { useForm } from "react-hook-form";
import { IReceipts } from "../types/IReceipts";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ReceiptValidator } from "../validators/index";
import AddReceiptForm from "../components/AddReceiptForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
}
const Add = ({ visible, onClose }: Props) => {
  const form = useForm<IReceipts>({
    defaultValues: {
      id: "",
      transactionMode: 3,
      transactionDate: "",
      paymentId: "",
      narration: "",
      totalAmount: 0,
      transactionItemsForReceipts: [
        {
          amount: 0,
          remarks: "",
          ledgerId: "",
        },
      ],
    },

    // resolver: yupResolver(ReceiptValidator),
  });
  const handleOnClose = () => {
    if (onClose) onClose();
  };
  if (!visible) return null;

  return <AddReceiptForm form={form} onClose={() => handleOnClose} />;
};
export default Add;
