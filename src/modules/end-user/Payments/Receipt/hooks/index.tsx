import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IReceipts } from "../types/IReceipts";

const ReceiptEndPoints = {
  getAllReceipts: "/api/TransactionControllers/all-Receipt",
  createReceipts: "/api/TransactionControllers/AddReceipt",
  removeReceipts: "/api/TransactionControllers/DeleteReceipt",
  addReceiptEntryDetails: "/api/TransactionControllers/AddReceiptEntryDetails",
  updateReceipts: "/api/TransactionControllers/UpdateReceiptEntry",
  getReceiptsById: "/api/TransactionControllers/Receipt",
  filterReceiptByDate: "/api/TransactionControllers/FilterReceiptByDate",
};

const queryKey = "Receipts";
type ReceiptRequest = {
  id: string;
  narration: string;
  transactionMode: number;
  transactionDate: string;
  paymentId: string;
  transactionItemsForReceipts: AddReceiptEntryDetail[];
};

type AddReceiptEntryDetail = {
  amount: number;
  remarks: string;
  id?: string;
  ledgerId: string;
};
export const useGetAllReceipts = (params: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${ReceiptEndPoints.getAllReceipts}${params}`
        : `${ReceiptEndPoints.getAllReceipts}`;
      const response = await api.get<IPaginationResponse<IReceipts>>(url);
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

export const useAddReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation<IReceipts, Error, ReceiptRequest>({
    mutationFn: async (data: ReceiptRequest): Promise<IReceipts> => {
      console.log("Add Receipt", data);
      const response = await api.post(ReceiptEndPoints.createReceipts, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding Receipt:", error);
    },
  });
};

export const useRemoveReceipt = () => {
  return useMutation<IReceipts, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IReceipts> => {
      if (!Id) {
        throw new Error("Id is required to remove a Receipt");
      }
      const response = await api.delete(
        `${ReceiptEndPoints.removeReceipts}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditReceipt = () => {
  return useMutation<
    IReceipts,
    Error,
    { id: string | unknown; data: ReceiptRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IReceipts> => {
      if (!id) {
        throw new Error("Ïd is required to edit Receipt");
      }
      const response = await api.patch(
        `${ReceiptEndPoints.updateReceipts}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetReceiptById = (ReceiptId: string) => {
  return useQuery({
    queryKey: [queryKey, ReceiptId],
    queryFn: async (): Promise<IReceipts> => {
      if (!ReceiptId) {
        throw new Error("Id is required to get a Receipt");
      }
      const response = await api.get<IReceipts>(
        `${ReceiptEndPoints.getReceiptsById}/${ReceiptId}`
      );
      return response.data;
    },
    enabled: !!ReceiptId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterReceiptByDate = (
  startDate: string,
  endDate: string,
  description?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, description, startDate, endDate], // Include all parameters for caching
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("StartDate and EndDate are required to get a Receipt");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      if (description) {
        queryParams.append("description", description);
      }

      const response = await api.get<IReceipts[]>(
        `${ReceiptEndPoints.filterReceiptByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
