import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IItemGroup } from "../types/IItemGroup";
const ItemGroupEndPoints = {
  getAllItemGroup: "/api/InventoryControllers/all-itemGroup",
  addItemGroup: "/api/InventoryControllers/AddItemGroup",
  getItemGroupById: "/api/InventoryControllers/ItemGroup",
  updateItemGroup: "/api/InventoryControllers/UpdateItemGroup",
  deleteItemGroup: "/api/InventoryControllers/DeleteItemGroup",
  filterItemGroupByDate: "/api/InventoryControllers/FilterItemGroupBy-Date",
};

const queryKey = "ItemGroup";

type ItemGroupRequest = {
  id: string;
  name: string;
  description: string | null;
  isPrimary: boolean;
  itemGroupId?: string;
};

export const useGetAllItemGroup = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${ItemGroupEndPoints.getAllItemGroup}${params}`
        : `${ItemGroupEndPoints.getAllItemGroup}`;
      const response = await api.get<IPaginationResponse<IItemGroup>>(url);
      return response.data;
    },
  });
};

export const useAddItemGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<IItemGroup, Error, ItemGroupRequest>({
    mutationFn: async (data: ItemGroupRequest): Promise<IItemGroup> => {
      const response = await api.post(ItemGroupEndPoints.addItemGroup, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding ItemGroup", error);
    },
  });
};

export const useRemoveItemGroup = () => {
  return useMutation<IItemGroup, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IItemGroup> => {
      if (!Id) {
        throw new Error("Id is required to delete a ItemGroup");
      }
      const response = await api.delete(
        `${ItemGroupEndPoints.deleteItemGroup}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditItemGroup = () => {
  return useMutation<
    IItemGroup,
    Error,
    { id: number | unknown; data: ItemGroupRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IItemGroup> => {
      if (!id) {
        throw new Error("Id is required to edit a Item Group");
      }
      const response = await api.patch(
        `${ItemGroupEndPoints.updateItemGroup}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetItemGroupById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(
        `${ItemGroupEndPoints.getItemGroupById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterItemGroupByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error(
          "StartDate and EndDate are required to get a ItemGroup"
        );
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<IItemGroup[]>(
        `${ItemGroupEndPoints.filterItemGroupByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
