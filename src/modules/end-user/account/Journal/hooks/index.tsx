import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IJournals } from "../types/IJournals";

const JournalEndPoints = {
  getAllJournals: "/api/AccountControllers/all-journal-entry",
  createJournals: "/api/AccountControllers/AddJournal",
  removeJournals: "/api/AccountControllers/DeleteJournalEntry",
  addJournalEntryDetails: "/api/AccountControllers/AddJournalEntryDetails",
  updateJournals: "/api/AccountControllers/UpdateJournalEntry",
  getJournalsById: "/api/AccountControllers/Journal",
  filterJournalByDate: "/api/AccountControllers/FilterJournalByDate",
};

const queryKey = "journals";
type JournalRequest = {
  referenceNumber: string;
  transactionDate: string;
  description: string;
  journalEntries: JournalEntryDetail[];
};
// type JournalUpdateRequest = {
//   referenceNumber: string;
//   transactionDate: string;
//   description: string;
//   UpdateJournalEntryDetails: [
//     {
//       id?: string;
//       ledgerId: string;
//       debitAmount: number;
//       creditAmount: number;
//     }
//   ];
// };

type JournalEntryDetail = {
  id?: string;
  ledgerId: string;
  debitAmount: number;
  creditAmount: number;
};

export const useGetAllJournals = (params: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${JournalEndPoints.getAllJournals}${params}`
        : `${JournalEndPoints.getAllJournals}`;
      const response = await api.get<IPaginationResponse<IJournals>>(url);
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      );
    },
  });
};

export const useAddJournal = () => {
  const queryClient = useQueryClient();
  return useMutation<IJournals, Error, JournalRequest>({
    mutationFn: async (data: JournalRequest): Promise<IJournals> => {
      console.log("Add journal", data);
      const response = await api.post(JournalEndPoints.createJournals, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding journal:", error);
    },
  });
};

export const useRemoveJournal = () => {
  return useMutation<IJournals, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IJournals> => {
      if (!Id) {
        throw new Error("Id is required to remove a journal");
      }
      const response = await api.delete(
        `${JournalEndPoints.removeJournals}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditJournal = () => {
  return useMutation<
    IJournals,
    Error,
    { id: string | unknown; data: JournalRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IJournals> => {
      if (!id) {
        throw new Error("Ïd is required to edit Journal");
      }
      const response = await api.patch(
        `${JournalEndPoints.updateJournals}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetJournalById = (journalId: string) => {
  return useQuery({
    queryKey: [queryKey, journalId],
    queryFn: async (): Promise<IJournals> => {
      if (!journalId) {
        throw new Error("Id is required to get a Journal");
      }
      const response = await api.get<IJournals>(
        `${JournalEndPoints.getJournalsById}/${journalId}`
      );
      return response.data;
    },
    enabled: !!journalId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterJournalByDate = (
  startDate: string,
  endDate: string,
  description?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, description, startDate, endDate], // Include all parameters for caching
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("StartDate and EndDate are required to get a Journal");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      if (description) {
        queryParams.append("description", description);
      }

      const response = await api.get<IJournals[]>(
        `${JournalEndPoints.filterJournalByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
