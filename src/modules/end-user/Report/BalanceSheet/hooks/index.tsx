import { api } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";
import { IBalanceSheet } from "../types/IBalanceSheet";
import { IPaginationResponse } from "@/types/IPaginationResponse";
const BalanceSheetEndPoints = {
  getBalanceSheet: "/api/Report/BalanceSheet",
};
const queryKey = "BalanceSheet";
export const useGetBalanceSheet = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],

    queryFn: async () => {
      const url = params
        ? `${BalanceSheetEndPoints.getBalanceSheet}${params}`
        : `${BalanceSheetEndPoints.getBalanceSheet}`;
      const response = await api.get<IPaginationResponse<IBalanceSheet>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
