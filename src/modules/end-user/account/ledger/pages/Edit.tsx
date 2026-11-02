import { useForm } from "react-hook-form";
import type { ILedgers } from "../types/ILedgers";
import EditLedgerForm from "../components/Editledger";
import { useGetLedgerById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ledgerId: string;
  currentPageIndex: number;
}

const EditLedger = ({
  visible,
  onClose,
  ledgerId,
  currentPageIndex,
}: Props) => {
  const { data: ledger } = useGetLedgerById(ledgerId);
  const form = useForm<ILedgers>({
    defaultValues: {
      id: ledger?.id ?? "",
      name: ledger?.name ?? "",
      address: ledger?.address ?? "",
      panNo: ledger?.panNo ?? "",
      phoneNumber: ledger?.phoneNumber ?? "",
      maxCreditPeriod: ledger?.maxCreditPeriod ?? "",
      maxDuePeriod: ledger?.maxDuePeriod ?? "",
      ledgerGroupId: ledger?.ledgerGroupId ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditLedgerForm
      form={form}
      onClose={() => onClose()}
      ledgerId={ledgerId}
      currentPageIndex={currentPageIndex}
    />
  );
};

export default EditLedger;
