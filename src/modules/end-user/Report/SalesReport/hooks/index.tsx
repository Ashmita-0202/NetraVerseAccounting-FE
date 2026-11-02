import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISalesReport } from "../types/ISalesReport";

const ReportEndpoints = {
  getSalesReport: "/api/Report/SalesReport",
};

const queryKey = "Report";

export const useGetSalesReport = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      try {
        const url = params
          ? `${ReportEndpoints.getSalesReport}${params}`
          : ReportEndpoints.getSalesReport;
        const response = await api.get<IPaginationResponse<ISalesReport>>(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Sales Report ");
      }
    },
    staleTime: 0 * 60 * 1000,
    retry: 2,
  });
};
