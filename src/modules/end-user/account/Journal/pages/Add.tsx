import { useForm } from "react-hook-form";
import type { IJournals } from "../types/IJournals";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { JournalValidator } from "../validators/index";
import AddJournalForm from "../components/Addjournal";

interface Props {
  visible: boolean;
  inset?: boolean;
  onClose?: () => void;
}
const Add = ({ visible, onClose, inset }: Props) => {
  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };
  const form = useForm<IJournals>({
    defaultValues: {
      referenceNumber: "",
      transactionDate: "",
      description: "",

      journalEntries: [
        { ledgerId: "", debitAmount: 0, creditAmount: 0 },
        { ledgerId: "", debitAmount: 0, creditAmount: 0 },
      ],
    },

    // resolver: yupResolver(JournalValidator),
  });

  if (!visible) return null;

  return (
    <div>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          inset
            ? "bg-white bg-opacity-80 ml-[12.9%]"
            : "bg-white bg-opacity-80 ml-[12.7%]"
        }`}
      >
        <div
          className={`transition-all duration-300 ease-in-out
    w-[60.4%] h-[70%]
    flex flex-col`}
        >
          <AddJournalForm form={form} onClose={() => handleFormClose} />;
        </div>
      </div>
    </div>
  );
};
export default Add;
