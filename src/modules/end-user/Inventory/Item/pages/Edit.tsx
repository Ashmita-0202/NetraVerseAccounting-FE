import { useForm } from "react-hook-form";
import { useGetItemById } from "../hooks";
import { IItem } from "../types/IItem";
import EditItemForm from "../components/EditFrom";

type Props = {
  visible: boolean;
  onClose: () => void;
  ItemId: string;
  currentPageIndex: number;
};

const EditItem = ({ visible, onClose, ItemId }: Props) => {
  const { isLoading } = useGetItemById(ItemId);

  const form = useForm<IItem>({
    defaultValues: {
      name: "",
      itemGroupId: "",
      unitId: "",
      sellingPrice: null,
      costPrice: null,
      barCodeField: null,
      expiredDate: null,
      serialNumbers: null,
      serialNumber: null,
      openingStockQuantity: null,
      price: null,
      hsCode: null,
      conversionFactorId: null,
      hasSerial: false,
    },
  });

  // useEffect(() => {
  //   if (itemData) {
  //     form.reset({
  //       name: itemData.name ?? "",
  //       itemGroupId: itemData.itemGroupId ?? "",
  //       unitId: itemData.unitId ?? "",
  //       sellingPrice: itemData.sellingPrice ?? "",
  //       costPrice: itemData.costPrice ?? "",
  //       barCodeField: itemData.barCodeField ?? "",
  //       expiredDate: itemData.expiredDate ?? "",
  //       openingStockQuantity: itemData.openingStockQuantity ?? "",
  //       serialNumbers: itemData.serialNumbers ?? [],
  //       hsCode: itemData.hsCode ?? "",
  //       entryDate: itemData.entryDate ?? "",
  //       minimumLevel: itemData.minimumLevel ?? 0,
  //       hasSerial: itemData.hasSerial ?? true,
  //     });
  //   }
  // }, [itemData, form]);

  if (!visible) return null;

  if (isLoading) {
    return <div className="p-4">Loading item data...</div>;
  }

  return <EditItemForm form={form} ItemId={ItemId} onClose={onClose} />;
};

export default EditItem;
