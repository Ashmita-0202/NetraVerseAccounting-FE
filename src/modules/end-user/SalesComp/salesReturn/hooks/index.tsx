import { api } from "@/utils/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ISalesReturn } from "../types/ISalesReturn";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISales } from "../../sales/types/ISales";

const salesReturnEndPoints = {
  addSalesReturnDetails: "/api/SalesControllers/AddSalesReturnDetails",
  getAllSalesReturn: "/api/SalesControllers/all-SalesDetailsReturn",
  removeSalesReturnDetails: "/api/SalesControllers/DeleteSalesReturnDetails",
  updateSalesReturn: "/api/SalesControllers/UpdateSalesReturnDetails",
  getSalesReturnById: "/api/SalesControllers/SalesReturnDetails",
  filterSalesByDate: "/api/SalesControllers/FilterSalesDetailsByDate",
  getSalesDetailsByRefId: "/api/SalesControllers/Sales-Details",
};
const queryKey = "salesReturn";
export const useAddSalesReturn = () => {
  const queryClient = useQueryClient();
  return useMutation<ISalesReturn, Error, ISalesReturn>({
    mutationFn: async (data: ISalesReturn): Promise<ISalesReturn> => {
      const response = await api.post(
        salesReturnEndPoints.addSalesReturnDetails,
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
      console.error("Error adding salesDetails:", error);
    },
  });
};

export const useRemoveSalesReturnDetails = () => {
  return useMutation<ISalesReturn, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISalesReturn> => {
      if (!Id) {
        throw new Error("Id is required to delete a  Conversion factor");
      }
      const response = await api.delete(
        `${salesReturnEndPoints.removeSalesReturnDetails}/${Id}`
      );
      return response.data;
    },
  });
};
export const useGetAllSalesReturn = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${salesReturnEndPoints.getAllSalesReturn}${params}`
        : `${salesReturnEndPoints.getAllSalesReturn}`;
      const response = await api.get<IPaginationResponse<ISalesReturn>>(url);
      return response.data;
    },
  });
};

export const useGetSalesReturnById = (salesId: string) => {
  return useQuery({
    queryKey: [queryKey, salesId],
    queryFn: async (): Promise<ISalesReturn> => {
      if (!salesId) {
        throw new Error("Id is required to get a salesDetails");
      }
      const response = await api.get<ISalesReturn>(
        `${salesReturnEndPoints.getSalesReturnById}/${salesId}`
      );
      return response.data;
    },
    enabled: !!salesId,
    staleTime: 0,
    retry: false,
  });
};
export const useGetSalesDet = (referenceId: string) => {
  return useQuery({
    queryKey: [queryKey, referenceId],
    queryFn: async (): Promise<ISales> => {
      if (!referenceId) {
        throw new Error("Id is required to get a purchaseDetails");
      }
      const response = await api.get<ISales>(
        `${salesReturnEndPoints.getSalesDetailsByRefId}/${referenceId}`
      );
      return response.data;
    },
    enabled: !!referenceId,
    staleTime: 0,
    retry: false,
  });
};
export const useGetFilterSalesReturnByDate = (
  startDate: string,
  endDate: string,
  ledgerId?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, ledgerId, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !ledgerId) {
        throw new Error("StartDate and EndDate are required to get a Sales");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ledgerId,
      });

      const response = await api.get<ISalesReturn[]>(
        `${salesReturnEndPoints.filterSalesByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
export const useGetSalesDetailsByReferenceId = (referenceId: string) => {
  return useQuery({
    queryKey: [queryKey, referenceId],
    queryFn: async (): Promise<ISales> => {
      if (!referenceId) {
        throw new Error("Id is required to get a salesDetails");
      }
      const encodedRefId = encodeURIComponent(referenceId);
      const response = await api.get<ISales>(
        `${salesReturnEndPoints.getSalesDetailsByRefId}/${encodedRefId}`
      );
      return response.data;
    },
    enabled: !!referenceId,
    staleTime: 0,
    retry: false,
  });
};
