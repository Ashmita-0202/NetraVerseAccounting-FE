import { useForm } from "react-hook-form";
import type { IItemGroup } from "../types/IItemGroup";
import { useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ItemGroupValidator } from "../validators/index";
import AddItemGroupForm from "../components/AddForm";
interface Props {
  visible: boolean;
  onClose: () => void;
}
const AddItemGroup = ({ visible, onClose }: Props) => {
  const form = useForm<IItemGroup>({
    defaultValues: {
      id: "",
      name: "",
      description: null,
      isPrimary: true,
      itemGroupId: "",
    },

    // resolver: yupResolver(ItemGroupValidator),
  });
  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        name: "",
        description: null,
        isPrimary: true,
        itemGroupId: "",
      });
    }
  }, [visible, form]);
  if (!visible) return null;

  return <AddItemGroupForm form={form} onClose={() => onClose()} />;
};
export default AddItemGroup;
