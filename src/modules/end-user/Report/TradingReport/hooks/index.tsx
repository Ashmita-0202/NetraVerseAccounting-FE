import { api } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";
import { ITradingReport } from "../types/ITradingReport";
const TradingReportEndPoints = {
  getTradingReport: "/api/Report/GetTradingReport",
};
const queryKey = "TradingReport";
export const useGetTradingReport = (params?: string | null) => {
  return useQuery({
    queryKey: [queryKey],

    queryFn: async () => {
      const url = params
        ? `${TradingReportEndPoints.getTradingReport}${params}`
        : `${TradingReportEndPoints.getTradingReport}`;
      const response = await api.get<ITradingReport>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
