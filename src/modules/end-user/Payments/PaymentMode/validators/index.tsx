import * as Yup from "yup";

export const JournalValidator = Yup.object().shape({
  transactionDate: Yup.string().required("Transaction date is required"),
  description: Yup.string().optional(),
  createdAt: Yup.string().required("Created at is required"),
  AddJournalEntryDetails: Yup.array().of(
    Yup.object().shape({
      ledgerId: Yup.string().required("Ledger ID is required"),
      debitAmount: Yup.number()
        .min(0, "Debit amount cannot be negative")
        .required("Debit amount is required"),
      creditAmount: Yup.number()
        .min(0, "Credit amount cannot be negative")
        .required("Credit amount is required"),
    })
  ),
});
