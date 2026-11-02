import { useForm } from "react-hook-form";
import type { IJournals } from "../types/IJournals";
import EditJournalForm from "../components/Editjournal";
import { useGetJournalById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  journalId: string;
  currentPageIndex: number;
}

const EditJournal = ({ visible, onClose, journalId }: Props) => {
  const { data: journal } = useGetJournalById(journalId);

  const form = useForm<IJournals>({
    defaultValues: {
      id: journal?.id ?? "",
      referenceNumber: journal?.referenceNumber ?? "",
      transactionDate: journal?.transactionDate ?? "",
      description: journal?.description ?? "",
      journalEntries:
        journal?.journalEntries?.map((entry) => ({
          id: entry.id,
          ledgerId: entry.ledgerId,
          debitAmount: entry.debitAmount,
          creditAmount: entry.creditAmount,
        })) ?? [],
    },
  });

  if (!visible) return null;

  return (
    <EditJournalForm form={form} onClose={onClose} journalId={journalId} />
  );
};

export default EditJournal;
