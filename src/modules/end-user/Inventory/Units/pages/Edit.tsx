import { useForm } from "react-hook-form";

import { IUnits } from "../types/IUnits";
import EditUnitsForm from "../components/EditUnitsForm";
import { useGetUnitsById } from "../hooks";
type Props = {
  visible: boolean;
  onClose: () => void;
  unitsId: string;
  currentPageIndex: number;
  //   masterId: number;
};
const EditUnits = ({ visible, onClose, unitsId, currentPageIndex }: Props) => {
  const { data: UnitsData } = useGetUnitsById(unitsId);
  const form = useForm<IUnits>({
    values: {
      id: UnitsData?.id ?? 0,
      name: UnitsData?.name ?? "",
      isEnabled: UnitsData?.isEnabled ?? "",
    },
  });

  if (!visible) return null;
  return (
    <EditUnitsForm
      form={form}
      unitsId={unitsId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditUnits;
