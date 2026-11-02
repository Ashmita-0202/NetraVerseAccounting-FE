import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ILedgerGroups } from "../types/ILedgerGroup";
const LedgerGroupEndPoints = {
  getAllLedgerGroups: "/api/AccountControllers/all-LedgerGroup",
  createLedgerGroups: "/api/AccountControllers/AddLedgerGroup",
  removeLedgerGroups: "/api/AccountControllers/DeleteLedgerGroup",
  updateLedgerGroups: "/api/AccountControllers/UpdateLedgerGroup",
  getLedgerGroupById: "/api/AccountControllers/LedgerGroup",
  getLedgerGroupByMaster: "/api/AccountControllers/LedgerGroupByMasterId",
  filterLedgerGroupByDate: "/api/AccountControllers/FilterLedgerGroupByDate",
};

const queryKey = "LedgerGroups";

type LedgerGroupRequest = {
  id: string;
  name: string;
  isCustom: boolean;
  masterId: string;
  isPrimary: boolean;
};

export const useGetAllLedgerGroups = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${LedgerGroupEndPoints.getAllLedgerGroups}${params}`
        : `${LedgerGroupEndPoints.getAllLedgerGroups}`;
      const response = await api.get<IPaginationResponse<ILedgerGroups>>(url);
      return response.data;
    },
  });
};

export const useAddLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ILedgerGroups, Error, LedgerGroupRequest>({
    mutationFn: async (data: LedgerGroupRequest): Promise<ILedgerGroups> => {
      const response = await api.post(
        LedgerGroupEndPoints.createLedgerGroups,
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
      console.log("Error adding LedgerGroup", error);
    },
  });
};
export const useRemoveLedgerGroup = () => {
  return useMutation<ILedgerGroups, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ILedgerGroups> => {
      if (!Id) {
        throw new Error("Id is required to edit a role");
      }
      const response = await api.delete(
        `${LedgerGroupEndPoints.removeLedgerGroups}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditLedgerGroup = () => {
  return useMutation<
    ILedgerGroups,
    Error,
    { id: string | unknown; data: LedgerGroupRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ILedgerGroups> => {
      if (!id) {
        throw new Error("Id is required to edit a institution");
      }
      const response = await api.patch(
        `${LedgerGroupEndPoints.updateLedgerGroups}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetLedgerGroupById = (Id: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(
        `${LedgerGroupEndPoints.getLedgerGroupById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerGroupsByMaster = (Id: string | null) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const url = `${LedgerGroupEndPoints.getLedgerGroupByMaster}/${Id}`;

      const response = await api.get<ILedgerGroups[]>(url);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};
export const useGetFilterLedgerGroupByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error(
          "StartDate and EndDate are required to get a LedgerGroup"
        );
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<ILedgerGroups[]>(
        `${
          LedgerGroupEndPoints.filterLedgerGroupByDate
        }?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
