import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import {
  IFilteredLedger,
  ILedgerBalance,
  ILedgerGroup,
  ILedgers,
} from "../types/ILedgers";
const ledgerEndPoints = {
  getAllLedgers: "/api/AccountControllers/all-ledger",
  createLedgers: "/api/AccountControllers/AddLedger",
  deleteLedgers: "/api/AccountControllers/DeleteLedger",
  getAllLedgergroup: "/api/AccountControllers/all-ledgerGroup",
  updateLedgers: "/api/AccountControllers/UpdateLedger",
  getLedgersById: "/api/AccountControllers/Ledger",
  getLedgerByLedgerGroupId: "/api/AccountControllers/LedgerByLedgerGroupId",
  getFilteredLedgerByLedgerGroup:
    "api/AccountControllers/FilterLedgerBySelectedLedgerGroup",
  getLedgerGroupByLedgerGroupId: "api/AccountControllers/LedgerGroup",
  filterLedgerByDate: "/api/AccountControllers/FilterLedgerByDate",
  getLedgerBalance: "/api/AccountControllers/LedgerBalance",
};

const queryKey = "ledgers";

type LedgerRequest = {
  id: string;
  name: string;
  address?: string;
  panNo?: string;
  phoneNumber?: string;
  maxCreditPeriod?: string;
  maxDuePeriod?: string;
  ledgerGroupId: string;
};

export const useGetAllLedgers = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${ledgerEndPoints.getAllLedgers}${params}`
        : `${ledgerEndPoints.getAllLedgers}`;
      const response = await api.get<IPaginationResponse<ILedgers>>(url);
      return response.data;
    },
  });
};

export const useGetAllFilteredLedgerGroup = () => {
  return useQuery({
    queryKey: ["filteredLedger"],
    queryFn: async () => {
      const url = ledgerEndPoints.getFilteredLedgerByLedgerGroup;
      const response = await api.get<IFilteredLedger[]>(url);
      return response.data;
    },
  });
};

export const useAddLedger = () => {
  const queryClient = useQueryClient();
  return useMutation<ILedgers, Error, LedgerRequest>({
    mutationFn: async (data: LedgerRequest): Promise<ILedgers> => {
      const response = await api.post(ledgerEndPoints.createLedgers, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding ledger", error);
    },
  });
};
export const useRemoveLedger = () => {
  return useMutation<ILedgers, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ILedgers> => {
      if (!Id) {
        throw new Error("Id is required to delete ledger");
      }
      const response = await api.delete(
        `${ledgerEndPoints.deleteLedgers}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditLedger = () => {
  return useMutation<
    ILedgers,
    Error,
    { id: string | unknown; data: LedgerRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ILedgers> => {
      if (!id) {
        throw new Error("Id is required to edit a ledger");
      }
      const response = await api.patch(
        `${ledgerEndPoints.updateLedgers}/${id}`,
        data
      );
      return response.data;
    },
  });
};
export const useGetLedgerById = (ledgerId: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, ledgerId],
    queryFn: async (): Promise<ILedgers> => {
      if (!ledgerId) {
        throw new Error("Id is required to get a ledger");
      }
      const response = await api.get<ILedgers>(
        `${ledgerEndPoints.getLedgersById}/${ledgerId}`
      );
      return response.data;
    },
    enabled: !!ledgerId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerBalance = (ledgerId: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, ledgerId],
    queryFn: async (): Promise<ILedgerBalance> => {
      if (!ledgerId) {
        throw new Error("Id is required to get a ledger balance");
      }
      const response = await api.get<ILedgerBalance>(
        `${ledgerEndPoints.getLedgerBalance}/${ledgerId}`
      );
      return response.data;
    },
    enabled: !!ledgerId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerByLedgerGroupId = (Id: string | null) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const url = `${ledgerEndPoints.getLedgerByLedgerGroupId}/${Id}`;

      const response = await api.get<ILedgers[]>(url);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetLedgerGroupByLedgerGroupId = (Id: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const url = `${ledgerEndPoints.getLedgerGroupByLedgerGroupId}/${Id}`;

      const response = await api.get<ILedgerGroup>(url);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterLedgerByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("StartDate and EndDate are required to get a Ledger");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<ILedgers[]>(
        `${ledgerEndPoints.filterLedgerByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
