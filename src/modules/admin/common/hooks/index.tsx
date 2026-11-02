import { useQuery } from "@tanstack/react-query";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { api } from "@/utils/instance";
import { IMaster } from "../types/IMaster";
const commonEntryPoints = {
  getAllMaster: "/api/AccountControllers/all-master",
};
export const useGetAllMasters = (params?: string) => {
  return useQuery({
    queryKey: ["master"],
    queryFn: async () => {
      const url = params
        ? `${commonEntryPoints.getAllMaster}${params}`
        : `${commonEntryPoints.getAllMaster}`;
      const response = await api.get<IPaginationResponse<IMaster>>(url);
      return response.data;
    },
  });
};
