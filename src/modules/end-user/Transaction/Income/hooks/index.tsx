import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";

import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IIncome } from "../types/IIncome";
const IncomeEndPoints = {
  getAllIncome: "/api/TransactionControllers/all-Income",
  addIncome: "/api/TransactionControllers/AddIncome",
  getIncomeById: "/api/TransactionControllers/Income",
  deleteTransaction: "/api/TransactionControllers/DeleteTransactions",
  //   getVoucherReceipt: "/api/TransactionControllers/vouchers-receipts",
};

const queryKey = "income";

export type IIncomeRequest = {
  id?: string;
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId?: string;
  addTransactionItemsForIncome: ITransactionsItemsForIncome[];
};
type ITransactionsItemsForIncome = {
  id?: string;
  amount: number;
  remarks: string;
  ledgerId: string;
};

export const useAddIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<IIncome, Error, IIncomeRequest>({
    mutationFn: async (data: IIncomeRequest): Promise<IIncome> => {
      console.log("Add Income", data);
      const response = await api.post(IncomeEndPoints.addIncome, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding IncomeDetails:", error);
    },
  });
};

export const useGetAllIncome = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${IncomeEndPoints.getAllIncome}${params}`
        : `${IncomeEndPoints.getAllIncome}`;
      const response = await api.get<IPaginationResponse<IIncome>>(url);
      return response.data;
    },
  });
};

export const useGetIncomeById = (expensesId: string) => {
  return useQuery({
    queryKey: [queryKey, expensesId],
    queryFn: async (): Promise<IIncome> => {
      if (!expensesId) {
        throw new Error("Id is required to get a IncomeDetails");
      }
      const response = await api.get<IIncome>(
        `${IncomeEndPoints.getIncomeById}/${expensesId}`
      );
      return response.data;
    },
    enabled: !!expensesId,
    staleTime: 0,
    retry: false,
  });
};

export const useRemoveTransaction = () => {
  return useMutation<IIncome, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IIncome> => {
      if (!Id) {
        throw new Error("Id is required to remove a expensesDetails");
      }
      const response = await api.delete(
        `${IncomeEndPoints.deleteTransaction}/${Id}`
      );
      return response.data;
    },
  });
};
// export const useGetVoucherReceipt = (transactionId: string | undefined) => {
//   return useQuery({
//     queryKey: [queryKey, transactionId],
//     queryFn: async (): Promise<IIncome> => {
//       if (!transactionId) {
//         throw new Error("Id is required to get a Transaction Details");
//       }
//       const response = await api.get<IIncome>(
//         `${expensesEndPoints.getVoucherReceipt}/${transactionId}`
//       );
//       return response.data;
//     },
//     enabled: !!transactionId,
//     staleTime: 0,
//     retry: false,
//   });
// };
