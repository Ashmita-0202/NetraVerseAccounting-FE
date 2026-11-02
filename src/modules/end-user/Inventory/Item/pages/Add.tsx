import { useForm } from "react-hook-form";
import type { IItem } from "../types/IItem";
import { useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ItemValidator } from "../validators/index";
import AddItemForm from "../components/AddFrom";
interface Props {
  visible: boolean;
  onClose?: () => void;
  inset?: boolean;
  itemIsAdded?: boolean;
  onItemAdded: (id: string) => void;
}
const AddItem = ({
  visible,
  onClose,
  itemIsAdded,
  onItemAdded,
  inset,
}: Props) => {
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

    // resolver: yupResolver(ItemValidator),
  });
  useEffect(() => {
    if (visible) {
      form.reset({
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
      });
    }
  }, [visible, form]);

  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`w-full h-full flex z-50 ${
        inset
          ? "fixed inset-0 ml-[13.6%] bg-black bg-opacity-50 flex  z-50 "
          : "inset-0  bg-white  ml-[13.6%] w-[86.4%] z-50 fixed"
      }`}
    >
      <div
        className={` bg-white  ${
          inset
            ? " bg-white ml-[-1%] w-[87.4%] h-full "
            : "w-full ml-[13.6%] h-full bg-white"
        }`}
      >
        <AddItemForm
          form={form}
          onClose={handleFormClose}
          itemIsAdded={itemIsAdded}
          onItemAdded={onItemAdded}
        />
      </div>
    </div>
  );
};
export default AddItem;
