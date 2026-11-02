import { useForm } from "react-hook-form";
import { IPurchase } from "@modules/end-user/PurchaseComp/purchase/types/Ipurchase";
import { useGetPurchaseById } from "../hooks";
import EditPurchaseForm from "../component/Editpurchasedetails";

interface Props {
  visible: boolean;
  onClose: () => void;
  purchaseId: string;
}

const EditPurchase = ({ visible, onClose, purchaseId }: Props) => {
  const { data: purchase } = useGetPurchaseById(purchaseId);
  const form = useForm<IPurchase>({
    defaultValues: {
      id: purchase?.id ?? "",
      date: purchase?.date ?? null,
      billNumber: purchase?.billNumber ?? null,
      ledgerId: purchase?.ledgerId ?? "",
      amountInWords: purchase?.amountInWords ?? "",
      discountPercent: purchase?.discountPercent ?? null,
      discountAmount: purchase?.discountAmount ?? null,
      paymentId: purchase?.paymentId ?? "",
      referenceNumber: purchase?.referenceNumber ?? "",
      vatPercent: purchase?.vatPercent ?? null,
      vatAmount: purchase?.vatAmount ?? null,
      grandTotalAmount: purchase?.grandTotalAmount ?? 0,

      PurchaseItems:
        purchase?.PurchaseItems?.map((Item) => ({
          id: Item.id ?? "",
          quantity: Item.quantity,
          unitId: Item.unitId,
          itemId: Item.itemId,
          price: Item.price,
          amount: Item.amount,
          serialNumbers: Item.serialNumbers ?? [""],
        })) ?? [],
    },
  });

  if (!visible) return null;

  return (
    <EditPurchaseForm form={form} onClose={onClose} PurchaseId={purchaseId} />
  );
};

export default EditPurchase;
