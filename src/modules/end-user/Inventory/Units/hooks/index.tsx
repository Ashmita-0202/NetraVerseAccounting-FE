import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IUnits } from "@modules/end-user/Inventory/Units/types/IUnits";
const UnitsEndPoints = {
  getAllUnits: "/api/InventoryControllers/all-Units",
  createUnits: "/api/InventoryControllers/AddUnits",
  removeUnits: "/api/InventoryControllers/DeleteUnits",
  updateUnits: "/api/InventoryControllers/UpdateUnits",
  getUnitsById: "/api/InventoryControllers/Units",
  filterUnitsByDate: "/api/InventoryControllers/Filter-UnitsByDate",
};

const queryKey = "Units";

type UnitsRequest = {
  id: string;
  name: string;
  isEnabled: boolean;
};

export const useGetAllUnits = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${UnitsEndPoints.getAllUnits}${params}`
        : `${UnitsEndPoints.getAllUnits}`;
      const response = await api.get<IPaginationResponse<IUnits>>(url);
      return response.data;
    },
  });
};

export const useAddUnits = () => {
  const queryClient = useQueryClient();
  return useMutation<IUnits, Error, UnitsRequest>({
    mutationFn: async (data: UnitsRequest): Promise<IUnits> => {
      const response = await api.post(UnitsEndPoints.createUnits, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding Units", error);
    },
  });
};
export const useRemoveUnits = () => {
  return useMutation<IUnits, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IUnits> => {
      if (!Id) {
        throw new Error("Id is required to delete a unit");
      }
      const response = await api.delete(`${UnitsEndPoints.removeUnits}/${Id}`);
      return response.data;
    },
  });
};

export const useEditUnits = () => {
  return useMutation<
    IUnits,
    Error,
    { id: number | unknown; data: UnitsRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IUnits> => {
      if (!id) {
        throw new Error("Id is required to edit a institution");
      }
      const response = await api.patch(
        `${UnitsEndPoints.updateUnits}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetUnitsById = (Id: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(`${UnitsEndPoints.getUnitsById}/${Id}`);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterUnitsByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("StartDate and EndDate are required to get a Units");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<IUnits[]>(
        `${UnitsEndPoints.filterUnitsByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
