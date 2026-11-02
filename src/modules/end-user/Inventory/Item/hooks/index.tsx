import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IItem } from "../types/IItem";
const ItemEndPoints = {
  getAllItem: "/api/InventoryControllers/all-Item",
  addItem: "/api/InventoryControllers/AddItem",
  getItemById: "/api/InventoryControllers/Item",
  updateItem: "/api/InventoryControllers/UpdateItem",
  deleteItem: "/api/InventoryControllers/DeleteItem",
  uploadItem: "/api/InventoryControllers/upload-items",
  filterItemByDate: "/api/InventoryControllers/FilterItemsByDate",
};

const queryKey = "Item";

type ItemRequest = {
  id: string;
  name: string;
  price?: number | null;
  itemGroupId: string;
  unitId: string;
  sellingPrice?: string | null;
  costPrice?: string | null;
  barCodeField?: string | null;
  expiredDate?: string | null;
  openingStockQuantity?: number | null;
  serialNumbers?: string[] | null;
  hsCode?: string | null;
  entryDate?: string | null;
  minimumLevel?: number | null;
  serialNumberCheckbox?: boolean;
  hasConversionFactor?: boolean;
  ExpiryCheckbox?: string;
  conversionFactorId?: string | null;
  serialNumber?: string[] | null;
  hasSerial?: boolean;
};

export const useGetAllItem = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${ItemEndPoints.getAllItem}${params}`
        : `${ItemEndPoints.getAllItem}`;
      const response = await api.get<IPaginationResponse<IItem>>(url);
      return response.data;
    },
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation<IItem, Error, ItemRequest>({
    mutationFn: async (data: ItemRequest): Promise<IItem> => {
      const response = await api.post(ItemEndPoints.addItem, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding Item", error);
    },
  });
};

export const useUploadItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("formFile", file);
      const response = await api.post(ItemEndPoints.uploadItem, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upload-items" + queryKey] });
    },
  });
};

export const useRemoveItem = () => {
  return useMutation<IItem, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IItem> => {
      if (!Id) {
        throw new Error("Id is required to delete a Item");
      }
      const response = await api.delete(`${ItemEndPoints.deleteItem}/${Id}`);
      return response.data;
    },
  });
};

export const useEditItem = () => {
  return useMutation<IItem, Error, { id: number | unknown; data: ItemRequest }>(
    {
      mutationFn: async ({ id, data }): Promise<IItem> => {
        if (!id) {
          throw new Error("Id is required to edit a Item Group");
        }
        const response = await api.patch(
          `${ItemEndPoints.updateItem}/${id}`,
          data
        );
        return response.data;
      },
    }
  );
};

export const useGetItemById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get<IItem>(
        `${ItemEndPoints.getItemById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useFilterItemsByDate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${ItemEndPoints.filterItemByDate}${params}`
          : ItemEndPoints.filterItemByDate;
        const response = await api.get<IPaginationResponse<IItem>>(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch items ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
