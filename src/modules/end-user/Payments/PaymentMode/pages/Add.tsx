import { useForm } from "react-hook-form";
import { IPaymentModes } from "../types/IPaymentModes";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ReceiptValidator } from "../validators/index";
import AddPaymentModeForm from "../components/AddPaymentMode";

interface Props {
  visible: boolean;
  onClose?: () => void;
}
const AddPaymentMode = ({ visible, onClose }: Props) => {
  const form = useForm<IPaymentModes>({
    defaultValues: {
      transactionMode: 4,
      transactionDate: "",
      paymentId: "",
      narration: "",
      totalAmount: 0,
      addTransactionItemsForPayments: [
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

  return <AddPaymentModeForm form={form} onClose={() => handleOnClose} />;
};
export default AddPaymentMode;
