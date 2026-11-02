import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import {
  IJournalReportResponse,
  IPurchaseReportResponse,
  ISalesReportResponse,
} from "../types/IReport";

const ReportEndpoints = {
  getSalesRegisterByLedger: "/api/Report/GetSalesRegisterByLedger",
  getPurchaseRegisterByLedger: "/api/Report/GetPurchaseRegisterByLedger",
  getJournalRegisterByLedger: "/api/Report/GetJournalRegisterByLedger",
};

const queryKey = "Report";

export const useGetSalesRegisterByLedger = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      try {
        const url = params
          ? `${ReportEndpoints.getSalesRegisterByLedger}${params}`
          : ReportEndpoints.getSalesRegisterByLedger;
        const response = await api.get<
          IPaginationResponse<ISalesReportResponse>
        >(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Sales register by ledger");
      }
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetPurchaseRegisterByLedger = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      try {
        const url = params
          ? `${ReportEndpoints.getPurchaseRegisterByLedger}${params}`
          : ReportEndpoints.getPurchaseRegisterByLedger;
        const response = await api.get<
          IPaginationResponse<IPurchaseReportResponse>
        >(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Purchase register by ledger");
      }
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetJournalRegisterByLedger = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${ReportEndpoints.getJournalRegisterByLedger}${params}`
          : ReportEndpoints.getJournalRegisterByLedger;
        const response = await api.get<
          IPaginationResponse<IJournalReportResponse>
        >(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Journal Register Report ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
