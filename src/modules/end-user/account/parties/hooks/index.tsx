import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IParties } from "../types/IParties";
const PartiesEndPoints = {
  getAllParties: "/api/AccountControllers/all-parties",
  filterPartiesByDate: "/api/AccountControllers/FilterPartiesByDate",
};

const queryKey = "Parties";
export const useGetAllParties = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${PartiesEndPoints.getAllParties}${params}`
        : `${PartiesEndPoints.getAllParties}`;
      const response = await api.get<IPaginationResponse<IParties>>(url);
      return response.data;
    },
  });
};
export const useGetFilterPartiesByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("StartDate and EndDate are required to get a Parties");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<IParties[]>(
        `${PartiesEndPoints.filterPartiesByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
