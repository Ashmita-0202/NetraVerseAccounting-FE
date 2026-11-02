import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IMaster } from "../types/IMaster";
const LedgerGroupEndPoints = {
  getAllMaster: "/api/AccountControllers/all-master",
  getMasterByMaster: "/api/AccountControllers/Master",
};

const queryKey = "Master";
export const useGetAllMaster = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${LedgerGroupEndPoints.getAllMaster}${params}`
        : `${LedgerGroupEndPoints.getAllMaster}`;
      const response = await api.get<IPaginationResponse<IMaster>>(url);
      return response.data;
    },
  });
};

export const useGetMasterByMaster = (Id: string | null) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const url = `${LedgerGroupEndPoints.getMasterByMaster}/${Id}`;

      const response = await api.get<IMaster>(url);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};
