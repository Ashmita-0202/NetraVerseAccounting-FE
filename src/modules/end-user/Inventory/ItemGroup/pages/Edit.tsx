import { useForm } from "react-hook-form";
import { useGetItemGroupById } from "../hooks";
import { IItemGroup } from "../types/IItemGroup";
import EditItemGroupForm from "../components/EditForm";
type Props = {
  visible: boolean;
  onClose: () => void;
  ItemGroupId: string;
  currentPageIndex: number;
  //   masterId: number;
};
const EditItemGroup = ({
  visible,
  onClose,
  ItemGroupId,
  currentPageIndex,
}: Props) => {
  const { data: ItemGroupData } = useGetItemGroupById(ItemGroupId);
  const form = useForm<IItemGroup>({
    values: {
      id: ItemGroupData?.id ?? "",
      name: ItemGroupData?.name ?? "",
      description: ItemGroupData?.description ?? "",
      isPrimary: ItemGroupData?.isPrimary ?? true,
      itemGroupId: ItemGroupData?.itemGroupId ?? "",
    },
  });

  if (!visible) return null;
  return (
    <EditItemGroupForm
      form={form}
      ItemGroupId={ItemGroupId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditItemGroup;
