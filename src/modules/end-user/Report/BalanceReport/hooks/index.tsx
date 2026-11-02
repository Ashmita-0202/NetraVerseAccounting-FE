import { api } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";
import { ILedgerBalance, ILedgerSummary } from "../types/ILedgerBalance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
const ledgerBalanceEndPoints = {
  filterLedgerBalance: "/api/Report/GetLedgerBalanceReport",
  getLedgerSummaryByLedger: "/api/Report/GetLedgerSummaryByLedger",
};
const queryKey = "LedgerBalance";

export const useGetFilterLedgerBalance = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${ledgerBalanceEndPoints.filterLedgerBalance}${params}`
          : ledgerBalanceEndPoints.filterLedgerBalance;
        const response = await api.get<IPaginationResponse<ILedgerBalance>>(
          url
        );
        return response.data;
      } catch {
        throw new Error("Failed to fetch Journal Register Report ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerBalance = (ledgerId?: string) => {
  return useQuery({
    queryKey: [queryKey, ledgerId],

    queryFn: async () => {
      const url = `${ledgerBalanceEndPoints.filterLedgerBalance}?ledgerId=${ledgerId}`;
      const response = await api.get<IPaginationResponse<ILedgerBalance>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerSummaryByLedger = (
  ledgerId?: string | null,
  params?: string
) => {
  return useQuery({
    queryKey: [queryKey, ledgerId],
    queryFn: async () => {
      const sanitizedParams = params ? params.replace(/^\?/, "") : "";
      const url = `${
        ledgerBalanceEndPoints.getLedgerSummaryByLedger
      }?ledgerId=${ledgerId}${sanitizedParams ? `&${sanitizedParams}` : ""}`;

      const response = await api.get<IPaginationResponse<ILedgerSummary>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
