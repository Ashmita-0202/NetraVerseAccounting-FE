import { api } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";
import { ITrialBalance } from "../types/ITrialBalance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
const TrialBalanceEndPoints = {
  getTrialBalance: "/api/Report/GetTrialBalance",
};
const queryKey = "TrialBalance";
export const useGetTrialBalance = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],

    queryFn: async () => {
      const url = params
        ? `${TrialBalanceEndPoints.getTrialBalance}${params}`
        : `${TrialBalanceEndPoints.getTrialBalance}`;
      const response = await api.get<IPaginationResponse<ITrialBalance>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
