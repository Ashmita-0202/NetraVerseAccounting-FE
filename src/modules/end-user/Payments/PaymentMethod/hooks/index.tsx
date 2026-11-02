import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPaymentMethod } from "../types/IPaymentMethod";
const PaymentMethodEndPoints = {
  getAllPaymentMethod: "/api/PaymentControllers/all-PaymentMethod",
  createPaymentMethod: "/api/PaymentControllers/AddPaymentMethod",
  removePaymentMethod: "/api/PaymentControllers/DeletePaymentMethod",
  updatePaymentMethod: "/api/PaymentControllers/UpdatePaymentMethod",
  getPaymentMethodById: "/api/TransactionControllers/Payment",
  filterPaymentMethodByDate:
    "/api/PaymentControllers/Filter-PaymentMethodByDate",
};

const queryKey = "PaymentMethod";

type PaymentMethodRequest = {
  id: string;
  name: string;
  ledgerGroupId: string;
  type: number;
};

export const useGetAllPaymentMethod = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${PaymentMethodEndPoints.getAllPaymentMethod}${params}`
        : `${PaymentMethodEndPoints.getAllPaymentMethod}`;
      const response = await api.get<IPaginationResponse<IPaymentMethod>>(url);
      return response.data;
    },
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation<IPaymentMethod, Error, PaymentMethodRequest>({
    mutationFn: async (data: PaymentMethodRequest): Promise<IPaymentMethod> => {
      const response = await api.post(
        PaymentMethodEndPoints.createPaymentMethod,
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

export const useRemovePaymentMethod = () => {
  return useMutation<IPaymentMethod, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IPaymentMethod> => {
      if (!Id) {
        throw new Error("Id is required to delete a unit");
      }
      const response = await api.delete(
        `${PaymentMethodEndPoints.removePaymentMethod}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditPaymentMethod = () => {
  return useMutation<
    IPaymentMethod,
    Error,
    { id: number | unknown; data: PaymentMethodRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IPaymentMethod> => {
      if (!id) {
        throw new Error("Id is required to edit a institution");
      }
      const response = await api.patch(
        `${PaymentMethodEndPoints.updatePaymentMethod}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetPaymentMethodById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(
        `${PaymentMethodEndPoints.getPaymentMethodById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterPaymentMethodByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error(
          "StartDate and EndDate are required to get a PaymentMethod"
        );
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<IPaymentMethod[]>(
        `${
          PaymentMethodEndPoints.filterPaymentMethodByDate
        }?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
