import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";

import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPurchaseReturn } from "../types/IPurchaseReturn";
import { IPurchase } from "../../purchase/types/Ipurchase";
const purchaseReturnEndPoints = {
  addPurchaseReturnDetails: "/api/PurchaseControllers/AddPurchaseReturnDetails",
  getAllPurchaseReturnDetails:
    "/api/PurchaseControllers/all-purchasereturndetails",
  removePurchaseReturnDetails:
    "/api/PurchaseControllers/DeletePurchaseReturnDetails",
  getPurchaseReturnById: "/api/PurchaseControllers/PurchaseReturnDetails",
  filterPurchaseByDate: "/api/PurchaseControllers/FilterPurchaseDetailsByDate",
  getPurchaseDetailsByRefId: "/api/PurchaseControllers/Purchase-Details",
};

const queryKey = "purchaseReturn";
export const useAddPurchaseReturn = () => {
  const queryClient = useQueryClient();
  return useMutation<IPurchaseReturn, Error, IPurchaseReturn>({
    mutationFn: async (data: IPurchaseReturn): Promise<IPurchaseReturn> => {
      console.log("Add PurchaseDetails", data);
      const response = await api.post(
        purchaseReturnEndPoints.addPurchaseReturnDetails,
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
      console.error("Error adding purchaseDetails:", error);
    },
  });
};

export const useRemovePurchaseReturnDetails = () => {
  return useMutation<IPurchaseReturn, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IPurchaseReturn> => {
      if (!Id) {
        throw new Error("Id is required to delete a  Conversion factor");
      }
      const response = await api.delete(
        `${purchaseReturnEndPoints.removePurchaseReturnDetails}/${Id}`
      );
      return response.data;
    },
  });
};
export const useGetAllPurchaseReturn = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${purchaseReturnEndPoints.getAllPurchaseReturnDetails}${params}`
        : `${purchaseReturnEndPoints.getAllPurchaseReturnDetails}`;
      const response = await api.get<IPaginationResponse<IPurchaseReturn>>(url);
      return response.data;
    },
  });
};

export const useGetPurchaseReturnById = (purchaseId: string) => {
  return useQuery({
    queryKey: [queryKey, purchaseId],
    queryFn: async (): Promise<IPurchaseReturn> => {
      if (!purchaseId) {
        throw new Error("Id is required to get a purchaseDetails");
      }
      const response = await api.get<IPurchaseReturn>(
        `${purchaseReturnEndPoints.getPurchaseReturnById}/${purchaseId}`
      );
      return response.data;
    },
    enabled: !!purchaseId,
    staleTime: 0,
    retry: false,
  });
};
export const useGetPurchaseDetailsByReferenceId = (referenceId: string) => {
  return useQuery({
    queryKey: [queryKey, referenceId],
    queryFn: async (): Promise<IPurchase> => {
      if (!referenceId) {
        throw new Error("Id is required to get a purchaseDetails");
      }
      const encodedRefId = encodeURIComponent(referenceId);
      const response = await api.get<IPurchase>(
        `${purchaseReturnEndPoints.getPurchaseDetailsByRefId}/${encodedRefId}`
      );
      return response.data;
    },
    enabled: !!referenceId,
    staleTime: 0,
    retry: false,
  });
};
export const useGetFilterPurchaseReturnByDate = (
  startDate: string,
  endDate: string,
  ledgerId?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, ledgerId, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !ledgerId) {
        throw new Error("StartDate and EndDate are required to get a Purchase");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ledgerId,
      });

      const response = await api.get<IPurchaseReturn[]>(
        `${
          purchaseReturnEndPoints.filterPurchaseByDate
        }?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
