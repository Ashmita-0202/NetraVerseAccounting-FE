import { useForm } from "react-hook-form";
import { useGetLedgerGroupById } from "../hooks";
import { ILedgerGroups } from "../types/ILedgerGroup";
import EditLedgerGroupForm from "../components/EditLedgerGroupForm";
import { MouseEvent } from "react";
type Props = {
  visible: boolean;
  onClose: () => void;
  ledgerGroupId: string;
  currentPageIndex: number;
  //   masterId: number;
};
const EditLedgerGroup = ({
  visible,
  onClose,
  ledgerGroupId,
  currentPageIndex,
}: Props) => {
  const { data: ledgerGroupDate } = useGetLedgerGroupById(ledgerGroupId);
  const form = useForm<ILedgerGroups>({
    values: {
      id: ledgerGroupDate?.id ?? 0,
      name: ledgerGroupDate?.name ?? "",
      isCustom: ledgerGroupDate?.isCustom ?? "",
      masterId: ledgerGroupDate?.masterId ?? "",
      isPrimary: ledgerGroupDate?.isPrimary ?? "",
    },
  });
  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "container") onClose();
  };
  if (!visible) return null;
  return (
    <div onClick={handleOnClose}>
      <EditLedgerGroupForm
        form={form}
        ledgerGroupId={ledgerGroupId}
        onClose={() => onClose()}
        currentPageIndex={currentPageIndex}
      />
    </div>
  );
};
export default EditLedgerGroup;
