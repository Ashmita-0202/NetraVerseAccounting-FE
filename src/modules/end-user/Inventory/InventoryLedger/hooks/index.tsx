import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IInventory, IRemaining, IInventoryItem } from "../types/IInventory";
const InventoryEndPoint = {
  getAllInventory: "/api/InventoryControllers/all-Inventory",
  getInventoryItem: "/api/InventoryControllers/GetInventoryItem",
  getRemainingQty: "/api/InventoryControllers/GetRemainingQtyByItemId",
  filterInventoryByDate: "/api/InventoryControllers/FilterInventoryByDate",
};

const queryKey = "Inventory";

export const useGetAllInventory = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${InventoryEndPoint.getAllInventory}${params}`
        : `${InventoryEndPoint.getAllInventory}`;
      const response = await api.get<IPaginationResponse<IInventory>>(url);
      return response.data;
    },
  });
};

export const useGetInventoryItem = (itemId: string | null) => {
  return useQuery({
    queryKey: [queryKey, itemId],
    queryFn: async () => {
      if (!itemId) {
        throw new Error("StartDate and EndDate are required to get a Item");
      }
      const response = await api.get<IInventoryItem[]>(
        `${InventoryEndPoint.getInventoryItem}/${itemId}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetRemainingQty = (itemId: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, itemId],
    queryFn: async (): Promise<IRemaining> => {
      if (!itemId) {
        throw new Error("Id is required to get a purchaseDetails");
      }
      const response = await api.get<IRemaining>(
        `${InventoryEndPoint.getRemainingQty}/${itemId}`
      );
      return response.data;
    },
    enabled: !!itemId,
    staleTime: 0,
    retry: false,
  });
};

export const useFilterInventoryByDate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${InventoryEndPoint.filterInventoryByDate}${params}`
          : InventoryEndPoint.filterInventoryByDate;
        const response = await api.get<IPaginationResponse<IInventory>>(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch items ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
