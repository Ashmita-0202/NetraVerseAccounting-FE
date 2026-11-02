import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";

import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IExpenses } from "../types/IExpenses";
const expensesEndPoints = {
  getAllExpenses: "/api/TransactionControllers/all-Expense",
  addExpenses: "/api/TransactionControllers/AddExpense",
  getExpensesById: "/api/TransactionControllers/Expense/{id}",
  // getVoucherReceipt: "/api/TransactionControllers/vouchers-receipts",
  updateTransactionDetails:
    "/api/TransactionControllers/UpdateTransactionDetails",
  // deleteTransaction: "/api/TransactionControllers/DeleteTransactions",
};

const queryKey = "expenses";

export type transactionRequest = {
  id?: string;
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId?: string;
  addTransactionsItemsForExpense: addExpensesItems[];
};
type addExpensesItems = {
  id?: string;
  amount: number;
  remarks: string;
  ledgerId: string;
};

export const useAddExpenses = () => {
  const queryClient = useQueryClient();
  return useMutation<IExpenses, Error, transactionRequest>({
    mutationFn: async (data: transactionRequest): Promise<IExpenses> => {
      console.log("Add Expenses", data);
      const response = await api.post(expensesEndPoints.addExpenses, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding expensesDetails:", error);
    },
  });
};

export const useGetAllExpenses = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${expensesEndPoints.getAllExpenses}${params}`
        : `${expensesEndPoints.getAllExpenses}`;
      const response = await api.get<IPaginationResponse<IExpenses>>(url);
      return response.data;
    },
  });
};
// export const useRemoveTransaction = () => {
//   return useMutation<IExpenses, Error, string | undefined>({
//     mutationFn: async (Id: string | undefined): Promise<IExpenses> => {
//       if (!Id) {
//         throw new Error("Id is required to remove a expensesDetails");
//       }
//       const response = await api.delete(
//         `${expensesEndPoints.deleteTransaction}/${Id}`
//       );
//       return response.data;
//     },
//   });
// };

export const useGetExpensesById = (expensesId: string) => {
  return useQuery({
    queryKey: [queryKey, expensesId],
    queryFn: async (): Promise<IExpenses> => {
      if (!expensesId) {
        throw new Error("Id is required to get a expensesDetails");
      }
      const response = await api.get<IExpenses>(
        `${expensesEndPoints.getExpensesById}/${expensesId}`
      );
      return response.data;
    },
    enabled: !!expensesId,
    staleTime: 0,
    retry: false,
  });
};

// export const useGetVoucherReceipt = (transactionId: string | undefined) => {
//   return useQuery({
//     queryKey: [queryKey, transactionId],
//     queryFn: async (): Promise<IVoucher> => {
//       if (!transactionId) {
//         throw new Error("Id is required to get a Transaction Details");
//       }
//       const response = await api.get<IVoucher>(
//         `${expensesEndPoints.getVoucherReceipt}/${transactionId}`
//       );
//       return response.data;
//     },
//     enabled: !!transactionId,
//     staleTime: 0,
//     retry: false,
//   });
// };

export const useEditTransaction = () => {
  return useMutation<
    IExpenses,
    Error,
    { id: string; data: transactionRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IExpenses> => {
      if (!id) {
        throw new Error("Id is required to edit expensesDetails");
      }
      const response = await api.patch(
        `${expensesEndPoints.updateTransactionDetails}/${id}`,
        data
      );
      return response.data;
    },
  });
};
