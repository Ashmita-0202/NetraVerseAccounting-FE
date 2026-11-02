import { useForm } from "react-hook-form";
import type { ILedgers } from "../types/ILedgers";
import { useEffect } from "react";
import AddLedgerForm from "../components/AddLedger";

interface Props {
  visible: boolean;
  ledgerIsAdded?: boolean;
  onClose?: () => void;
  onLedgerAdded: (id: string) => void;
  inset?: boolean;
}

const AddL = ({
  visible,
  onClose,
  ledgerIsAdded,
  onLedgerAdded,
  inset,
}: Props) => {
  const form = useForm<ILedgers>({
    defaultValues: {
      id: "",
      name: "",
      address: "",
      panNo: "",
      phoneNumber: "",
      maxCreditPeriod: "",
      maxDuePeriod: "",
      ledgerGroupId: "",
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        name: "",
        address: "",
        panNo: "",
        phoneNumber: "",
        maxCreditPeriod: "",
        maxDuePeriod: "",
        ledgerGroupId: "",
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
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        inset
          ? "bg-white bg-opacity-80 ml-[11.9%]"
          : "bg-white bg-opacity-80  ml-[10.7%]"
      }`}
    >
      <div
        className={`bg-white shadow-2xl rounded-l-lg border border-gray-200
        transition-all duration-300 ease-in-out
        w-[60.4%] h-[70%] overflow-y-auto
        flex flex-col`}
      >
        <AddLedgerForm
          form={form}
          onClose={handleFormClose}
          onLedgerAdded={onLedgerAdded}
          ledgerIsAdded={ledgerIsAdded}
        />
      </div>
    </div>
  );
};

export default AddL;
