// import { useForm } from "react-hook-form";
// import { IIncome, IIncomeItems } from "../types/IIncome";
// import { useGetIncomeById } from "../hooks";
// import EditIncomeForm from "../component/EditIncomeForm";

import { useForm } from "react-hook-form";
import { useGetExpensesById } from "../../Expenses/hooks/index";

import { IExpenses } from "../../Expenses/types/IExpenses";
import EditExpenseForm from "../component/EditIncomeForm";

interface Props {
  visible: boolean;
  onClose: () => void;
  incomeId: string;
}

const EditIncome = ({ visible, incomeId, onClose }: Props) => {
  const { data: ExpenseData } = useGetExpensesById(incomeId);
  const form = useForm<IExpenses>({
    defaultValues: {
      id: ExpenseData?.id ?? "",
      transactionDate: ExpenseData?.transactionDate ?? "",
      totalAmount: ExpenseData?.totalAmount ?? 0,
      narration: ExpenseData?.narration ?? "",
      paymentId: ExpenseData?.paymentId ?? "",
      transactionMode: ExpenseData?.transactionMode ?? 1,

      addTransactionsItemsForExpense:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ExpenseData?.addTransactionsItemsForExpense?.map((Item: any) => ({
          id: Item.id,
          remarks: Item.remarks,
          ledgerId: Item.ledgerId,
          amount: Item.amount,
        })) ?? [],
    },
  });

  if (!visible) return null;
  return (
    <div className="ml-[12.7%]">
      <EditExpenseForm form={form} expenseId={incomeId} onClose={onClose} />
    </div>
  );
};

export default EditIncome;
