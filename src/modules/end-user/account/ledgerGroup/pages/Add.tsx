import { useForm } from "react-hook-form";
import type { ILedgerGroups } from "../types/ILedgerGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MouseEvent } from "react";
import { LedgerGroupValidator } from "../validators/index";
import AddLedgerGroupForm from "../components/AddLedgerGroupForm";
interface Props {
  visible: boolean;
  onClose: () => void;
}
const Add = ({ visible, onClose }: Props) => {
  const form = useForm<ILedgerGroups>({
    defaultValues: {
      id: "",
      name: "",
      isCustom: true,
      masterId: "",
      isPrimary: true,
    },

    resolver: yupResolver(LedgerGroupValidator),
  });
  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "container") onClose();
  };
  if (!visible) return null;

  return (
    <div onClick={handleOnClose}>
      <AddLedgerGroupForm form={form} onClose={() => onClose()} />
    </div>
  );
};
export default Add;
