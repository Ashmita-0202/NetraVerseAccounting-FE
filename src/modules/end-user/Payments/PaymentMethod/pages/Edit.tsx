import { useForm } from "react-hook-form";

import { IPaymentMethod } from "../types/IPaymentMethod";
import EditPaymentMethodForm from "../components/EditPaymentMethodForm";
import { useGetPaymentMethodById } from "../hooks";
type Props = {
  visible: boolean;
  onClose: () => void;
  unitsId: string;
  currentPageIndex: number;
  //   masterId: number;
};
const EditPaymentMethod = ({
  visible,
  onClose,
  unitsId,
  currentPageIndex,
}: Props) => {
  const { data: PaymentMethodData } = useGetPaymentMethodById(unitsId);
  const form = useForm<IPaymentMethod>({
    values: {
      id: PaymentMethodData?.id ?? 0,
      name: PaymentMethodData?.name ?? "",
      type: PaymentMethodData?.type ?? 0,
      ledgerGroupId: PaymentMethodData?.ledgerGroupId ?? "",
    },
  });

  if (!visible) return null;
  return (
    <EditPaymentMethodForm
      form={form}
      unitsId={unitsId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditPaymentMethod;
