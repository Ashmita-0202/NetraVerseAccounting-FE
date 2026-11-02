import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPaymentModes } from "../types/IPaymentModes";
const PaymentModeEndPoints = {
  getAllPaymentMode: "/api/TransactionControllers/all-Payment",
  AddPaymentMode: "/api/TransactionControllers/AddPayments",
  getPaymentModeById: "/api/TransactionControllers/Payment",
};

const queryKey = "PaymentMode";

type PaymentModeRequest = {
  transactionDate: string;
  totalAmount: number;
  narration: string;
  transactionMode: number;
  paymentId: string;
  addTransactionItemsForPayments: AddTransactionItem[];
};
type AddTransactionItem = {
  amount: number;
  remarks: string;
  ledgerId: string;
};

export const useGetAllPaymentMode = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${PaymentModeEndPoints.getAllPaymentMode}${params}`
        : `${PaymentModeEndPoints.getAllPaymentMode}`;
      const response = await api.get<IPaginationResponse<IPaymentModes>>(url);
      return response.data;
    },
  });
};

export const useAddPaymentMode = () => {
  const queryClient = useQueryClient();
  return useMutation<IPaymentModes, Error, PaymentModeRequest>({
    mutationFn: async (data: PaymentModeRequest): Promise<IPaymentModes> => {
      const response = await api.post(
        PaymentModeEndPoints.AddPaymentMode,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding PaymentMethod", error);
    },
  });
};

export const useGetPaymentModeById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(
        `${PaymentModeEndPoints.getPaymentModeById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};
