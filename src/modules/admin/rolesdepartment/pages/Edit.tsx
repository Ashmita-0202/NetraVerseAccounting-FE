import { useForm } from "react-hook-form";
import { IRoles } from "../types/IRoles";
import EditRoleForm from "../components/EditRoleForm";
import { MouseEvent } from "react";
import { useGetRolesByRoleId } from "../hooks";
interface Props {
  visible: boolean;
  Id: string;
  onClose: () => void;
  roleId: string;
  currentPageIndex: number;
}
const EditRole = ({
  visible,
  Id,
  onClose,
  roleId,
  currentPageIndex,
}: Props) => {
  const { data: role } = useGetRolesByRoleId(roleId);
  const form = useForm<IRoles>({
    values: {
      Id: role?.Id ?? "",
      Name: role?.Name ?? "",
    },
  });
  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "container") onClose();
  };
  if (!visible) return null;
  return (
    <div onClick={handleOnClose}>
      <EditRoleForm
        form={form}
        Id={Id}
        onClose={() => onClose}
        currentPageIndex={currentPageIndex}
      />
    </div>
  );
};

export default EditRole;
