import { useForm } from "react-hook-form";
import { IReceipts } from "../../Receipt/types/IReceipts";
import { useGetReceiptById } from "../../Receipt/hooks";
import EditPaymentModeForm from "../components/EditPaymentMode";

interface Props {
  visible: boolean;
  onClose: () => void;
  ReceiptId: string;
}

const EditPaymentMode = ({ visible, onClose, ReceiptId }: Props) => {
  const { data: Receipt } = useGetReceiptById(ReceiptId);

  const form = useForm<IReceipts>({
    defaultValues: {
      id: Receipt?.id ?? "",
      transactionMode: Receipt?.transactionMode ?? 0,
      transactionDate: Receipt?.transactionDate ?? "",
      paymentId: Receipt?.paymentId ?? "",
      narration: Receipt?.narration ?? "",
      totalAmount: Receipt?.totalAmount ?? 0,
      transactionItemsForReceipts:
        Receipt?.transactionItemsForReceipts?.map((entry) => ({
          id: entry.id,
          amount: entry.amount,
          remarks: entry.remarks,
          ledgerId: entry.ledgerId,
        })) ?? [],
    },
  });

  if (!visible) return null;

  return (
    <EditPaymentModeForm form={form} onClose={onClose} ReceiptId={ReceiptId} />
  );
};

export default EditPaymentMode;
