import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import {
  IInventoryStatus,
  IItemStatus,
  IJournalStatus,
} from "../types/ISettings";
const settingsEndPoints = {
  getItemStatusByCompany: "/api/Settings/GetItemStatusByCompany",
  updateItemStatusByCompany: "/api/Settings/UpdateItemStatusByCompany",
  getJournalStatusByCompany: "/api/Settings/GetJournalRefByCompany",
  updateJournalStatusByCompany: "/api/Settings/UpdateJournalRefByCompany",
  updateInventoryMethod: "/api/Settings/UpdateInventoryMethod",
  getInventoryMethod: "/api/Settings/GetInventoryMethodByCompany",
};
type ItemStatusRequest = {
  id?: string;
  isExpiredDate: boolean;
  isSerialNo: boolean;
};
type InventoryRequest = {
  inventoryMethod: number;
  companyId: string;
};
type JournalStatusRequest = {
  journalReferences: number;
  companyId: string;
};
export const useGetItemStatusByCompany = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["expiredDate"],
    queryFn: async () => {
      const response = await api.get(
        `${settingsEndPoints.getItemStatusByCompany}/${CompanyId}`
      );
      return response.data;
    },
  });
};
export const useGetInventoryStatusByCompany = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["inventoryStatus"],
    queryFn: async () => {
      const response = await api.get(
        `${settingsEndPoints.getInventoryMethod}/${CompanyId}`
      );
      return response.data;
    },
  });
};
export const useUpdateItemStatusByCompany = () => {
  return useMutation<
    IItemStatus,
    Error,
    { id: string | null; data: ItemStatusRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IItemStatus> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${settingsEndPoints.updateItemStatusByCompany}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useUpdateInventoryMethod = () => {
  return useMutation<
    IInventoryStatus,
    Error,
    { id: string | null; data: InventoryRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IInventoryStatus> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${settingsEndPoints.updateInventoryMethod}/${id}`,
        data
      );
      return response.data;
    },
  });
};
export const useGetJournalRefByCompany = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["reference"],
    queryFn: async () => {
      const response = await api.get(
        `${settingsEndPoints.getJournalStatusByCompany}/${CompanyId}`
      );
      return response.data;
    },
  });
};

export const useUpdateJournalRefByCompany = () => {
  return useMutation<
    IJournalStatus,
    Error,
    { id: string | null; data: JournalStatusRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IJournalStatus> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${settingsEndPoints.updateJournalStatusByCompany}/${id}`,
        data
      );
      return response.data;
    },
  });
};
