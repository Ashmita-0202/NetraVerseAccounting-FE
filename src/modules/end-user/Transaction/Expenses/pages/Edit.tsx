// import { useForm } from "react-hook-form";
// import { IExpense, IExpenseItems } from "../types/IExpense";
// import { useGetExpenseById } from "../hooks";
// import EditExpenseForm from "../component/EditExpenseForm";

import { useForm } from "react-hook-form";
import { useGetExpensesById } from "../../Expenses/hooks";
import EditExpenseForm from "../component/EditExpenses";
import { IExpenses } from "../../Expenses/types/IExpenses";

interface Props {
  visible: boolean;
  onClose: () => void;
  expenseId: string;
}

const EditExpense = ({ visible, expenseId, onClose }: Props) => {
  const { data: ExpenseData } = useGetExpensesById(expenseId);
  const form = useForm<IExpenses>({
    defaultValues: {
      id: ExpenseData?.id ?? "",
      transactionDate: ExpenseData?.transactionDate ?? "",
      totalAmount: ExpenseData?.totalAmount ?? 0,
      narration: ExpenseData?.narration ?? "",
      paymentId: ExpenseData?.paymentId ?? "",
      transactionMode: ExpenseData?.transactionMode ?? 1,

      addTransactionsItemsForExpense:
        ExpenseData?.addTransactionsItemsForExpense?.map((Item) => ({
          id: Item.id,
          remarks: Item.remarks,
          ledgerId: Item.ledgerId,
          amount: Item.amount,
        })) ?? [],
    },
  });

  if (!visible) return null;
  return (
    <div>
      <EditExpenseForm form={form} expenseId={expenseId} onClose={onClose} />
    </div>
  );
};

export default EditExpense;
