import { api } from "@/utils/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ISales,
  IBillNumberGenerationForSales,
  IReferenceGenerationForSales,
  ITaxForSales,
} from "../types/ISales";
import { IPaginationResponse } from "@/types/IPaginationResponse";

const SalesEndPoints = {
  getTaxForSales: "/api/Settings/GetTaxStatusInSales",
  updateTaxForSales: "/api/Settings/UpdateTaxStatusInSales",
  updateReferenceNumberGeneration: "/api/Settings/UpdateSalesRefByCompany",
  referenceNumber: "/api/Settings/GetSalesReferenceNumberByCompany",
  createSales: "/api/SalesControllers/AddSalesDetails",
  getAllSales: "/api/SalesControllers/all-SalesDetails",
  removeSales: "/api/SalesControllers/DeleteSalesDetails",
  updateSales: "/api/SalesControllers/UpdateSalesDetails",
  getSalesById: "/api/SalesControllers/SalesDetails",
  billNumberGeneration: "api/SalesControllers/BillNumberGenerationSales",
  updateBillNumberGenerationSales:
    "api/SalesControllers/UpdateSalesBillStatusByCompany",
  filterSalesByDate: "/api/SalesControllers/FilterSalesDetailsByDate",
  getSalesDetailsItems: "/api/SalesControllers/SalesDetailsItems",
};
const queryKey = "sales";
type SalesRequest = {
  date: string | null;
  billNumber: string;
  ledgerId: string;
  amountInWords: string;
  discountPercent: string | null;
  discountAmount: string | null;
  vatPercent: string | null;
  vatAmount: string | null;
  referenceNumber?: string | null;
  salesStatus?: number;
  grandTotalAmount: string;
  totalQuantity?: number;
  paymentId: string;
  salesItems: addSalesItems[];
};
type addSalesItems = {
  quantity: number;
  unitId: string;
  itemId: string;
  price: number;
  amount: string;
  serialNumbers?: string[];
};
type billNumberGenerationRequestForSales = {
  id?: string;
  BillNumberGenerationType: 0;
};
type referenceNumberGenerationRequest = {
  id?: string;
  showReferenceNumberForSales: boolean;
};
type taxForSalesRequest = {
  companyId?: string;
  showTaxInSales: boolean;
};
export const useGetAllSales = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],

    queryFn: async () => {
      const url = params
        ? `${SalesEndPoints.getAllSales}${params}`
        : `${SalesEndPoints.getAllSales}`;
      const response = await api.get<IPaginationResponse<ISales>>(url);
      return response.data;
    },
  });
};

export const useGetSalesById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get<ISales>(
        `${SalesEndPoints.getSalesById}/${Id}`
      );

      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useAddSales = () => {
  const queryClient = useQueryClient();
  return useMutation<ISales, Error, SalesRequest>({
    mutationFn: async (data: SalesRequest): Promise<ISales> => {
      const response = await api.post(SalesEndPoints.createSales, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.log("Error adding Sales", error);
    },
  });
};

export const useEditSales = () => {
  return useMutation<ISales, Error, { id: string; data: SalesRequest }>({
    mutationFn: async ({ id, data }): Promise<ISales> => {
      if (!id) {
        throw new Error("Id is required to edit a sale");
      }
      console.log("Sending update with data:", data);
      const response = await api.patch(
        `${SalesEndPoints.updateSales}/${id}`,
        data
      );
      console.log("Update response:", response.data);
      return response.data;
    },
  });
};

export const useGetTaxForSales = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["SalesForTax"],
    queryFn: async () => {
      const response = await api.get(
        `${SalesEndPoints.getTaxForSales}/${CompanyId}`
      );
      return response.data;
    },
    retry: false,
  });
};
export const useEditTaxForSales = () => {
  return useMutation<
    ITaxForSales,
    Error,
    { id: string | null; data: taxForSalesRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ITaxForSales> => {
      if (!id) {
        throw new Error("Ïd is required to edit reference number generation");
      }
      const response = await api.patch(
        `${SalesEndPoints.updateTaxForSales}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};

export const useGetReferenceNumberForSales = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["SalesReferenceNumber"],
    queryFn: async () => {
      const response = await api.get(
        `${SalesEndPoints.referenceNumber}/${CompanyId}`
      );
      return response.data;
    },
    retry: false,
  });
};

export const useEditReferenceNumberForSales = () => {
  return useMutation<
    IReferenceGenerationForSales,
    Error,
    { id: string | null; data: referenceNumberGenerationRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IReferenceGenerationForSales> => {
      if (!id) {
        throw new Error("Ïd is required to edit reference number generation");
      }
      const response = await api.patch(
        `${SalesEndPoints.updateReferenceNumberGeneration}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};

export const useRemoveSales = () => {
  return useMutation<ISales, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISales> => {
      if (!Id) {
        throw new Error("Id is required to edit sales");
      }
      const response = await api.delete(`${SalesEndPoints.removeSales}/${Id}`);
      return response.data;
    },
  });
};

export const useEditBillNumberGenerationForSales = () => {
  return useMutation<
    IBillNumberGenerationForSales,
    Error,
    { id: string | null; data: billNumberGenerationRequestForSales }
  >({
    mutationFn: async ({
      id,
      data,
    }): Promise<IBillNumberGenerationForSales> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${SalesEndPoints.updateBillNumberGenerationSales}/${id}`,
        data
      );
      return response.data;
    },
  });
};
export const useGetBillNumberGenerationForSales = (
  CompanyId: string | null
) => {
  return useQuery({
    queryKey: ["billNumberForSales"],
    queryFn: async () => {
      const response = await api.get(
        `${SalesEndPoints.billNumberGeneration}/${CompanyId}`
      );
      return response.data;
    },
  });
};

export const useGetFilterSalesByDate = (
  startDate: string,
  endDate: string,
  ledgerId?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, ledgerId, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !ledgerId) {
        throw new Error("StartDate and EndDate are required to get a Sales");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ledgerId,
      });

      const response = await api.get<ISales[]>(
        `${SalesEndPoints.filterSalesByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetSalesDetailsItems = (itemId: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, itemId],
    queryFn: async () => {
      const response = await api.get(
        `${SalesEndPoints.getSalesDetailsItems}/${itemId}`
      );
      return response.data;
    },
    enabled: !!itemId,
    staleTime: 0,
    retry: false,
  });
};
