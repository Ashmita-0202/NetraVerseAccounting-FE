import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPurchaseReport } from "../types/IPurchaseReport";

const ReportEndpoints = {
  getPurchaseReport: "/api/Report/PurchaseReport",
};

const queryKey = "Report";

export const useGetPurchaseReport = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      try {
        const url = params
          ? `${ReportEndpoints.getPurchaseReport}${params}`
          : ReportEndpoints.getPurchaseReport;
        const response = await api.get<IPaginationResponse<IPurchaseReport>>(
          url
        );
        return response.data;
      } catch {
        throw new Error("Failed to fetch Purchase Report ");
      }
    },
    staleTime: 0 * 60 * 1000,
    retry: 2,
  });
};
