import { useForm } from "react-hook-form";
import { ISales } from "../types/ISales";
import EditSalesForm from "../component/EditSalesForm";
import { useGetSalesById } from "../hooks";
interface Props {
  visible: boolean;
  onClose: () => void;
  SalesId: string;
  currentPageIndex: number;
}

const EditSales = ({ visible, onClose, SalesId }: Props) => {
  const { data: Sales } = useGetSalesById(SalesId);
  const form = useForm<ISales>({
    defaultValues: {
      id: Sales?.id ?? "",
      date: Sales?.date ?? "",
      billNumber: Sales?.billNumber ?? "",
      ledgerId: Sales?.ledgerId ?? "",
      amountInWords: Sales?.amountInWords ?? "",
      discountPercent: Sales?.discountPercent ?? "",
      discountAmount: Sales?.discountAmount ?? "",
      vatPercent: Sales?.vatPercent ?? "",
      vatAmount: Sales?.vatAmount ?? "",
      salesItems:
        Sales?.salesItems?.map((Items) => ({
          quantity: Items.quantity,
          unitId: Items.unitId,
          itemId: Items.itemId,
          price: Items.price,
          amount: Items.amount,
          serialNumbers: Items.serialNumbers,
        })) ?? [],
    },
  });

  if (!visible) return null;
  return <EditSalesForm form={form} onClose={onClose} SalesId={SalesId} />;
};
export default EditSales;
