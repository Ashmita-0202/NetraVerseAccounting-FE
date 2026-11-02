import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";

import { IPaginationResponse } from "@/types/IPaginationResponse";
import {
  IPurchase,
  IBillNumberGeneration,
  IPurchaseItems,
  IReferenceGenerationForPurchase,
  ITaxForPurchase,
} from "@modules/end-user/PurchaseComp/purchase/types/Ipurchase";
const purchaseEndPoints = {
  updateTaxForPurchase: "/api/Settings/UpdateTaxStatusInPurchase",
  getTaxForPurchase: "/api/Settings/GetTaxStatusInPurchase",
  updateReferenceNumberGeneration: "/api/Settings/UpdatePurchaseRefByCompany",
  referenceNumber: "/api/Settings/GetPurchaseReferenceNumberByCompany",
  getallpurchaseItems: "/api/PurchaseControllers/all-PurchaseItems",
  createPurchaseDetails: "/api/PurchaseControllers/AddPurchaseDetails",
  getAllPurchaseDetails: "/api/PurchaseControllers/all-PurchaseDetails",
  removePurchaseDetails: "/api/PurchaseControllers/DeletePurchaseDetails",
  getPurchaseDetailsById: "/api/PurchaseControllers/PurchaseDetails",
  updatePurchaseDetails: "/api/PurchaseControllers/UpdatePurchaseDetails",
  billNumberGeneration:
    "/api/PurchaseControllers/BillNumberGenerationForPurchase",
  updateBillNumberGenerationPurchase:
    "/api/PurchaseControllers/UpdatePurchaseBillStatusByCompany",
  filterPurchaseByDate: "/api/PurchaseControllers/FilterPurchaseDetailsByDate",
};

const queryKey = "purchase";

export type purchaseRequest = {
  id?: string;
  date: string | null;
  billNumber: string | null;
  ledgerId: string;
  amountInWords: string;
  discountPercent: string | null;
  discountAmount: string | null;
  vatPercent: string | null;
  vatAmount: string | null;
  grandTotalAmount: number | null;
  paymentId: string;
  status?: number;
  totalQuantity?: number;
  PurchaseItems: addPurchaseItems[];
};
type addPurchaseItems = {
  id?: string;
  quantity: number;
  unitId: string;
  itemId: string;
  price: number;
  amount: number;
  serialNumbers?: string[];
};
type billNumberGenerationRequest = {
  id?: string;
  BillNumberGenerationType: 0;
};
type referenceNumberGenerationRequest = {
  id?: string;
  showReferenceNumberForPurchase: boolean;
};
type taxForPurchaseRequest = {
  companyId?: string;
  showTaxInPurchase: boolean;
};
export const useAddPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation<IPurchase, Error, purchaseRequest>({
    mutationFn: async (data: purchaseRequest): Promise<IPurchase> => {
      console.log("Add PurchaseDetails", data);
      const response = await api.post(
        purchaseEndPoints.createPurchaseDetails,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding purchaseDetails:", error);
    },
    retry: false,
  });
};

export const useGetAllPurchase = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${purchaseEndPoints.getAllPurchaseDetails}${params}`
        : `${purchaseEndPoints.getAllPurchaseDetails}`;
      const response = await api.get<IPaginationResponse<IPurchase>>(url);
      return response.data;
    },
    retry: false,
  });
};
export const useRemovePurchase = () => {
  return useMutation<IPurchase, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IPurchase> => {
      if (!Id) {
        throw new Error("Id is required to remove a purchaseDetails");
      }
      const response = await api.delete(
        `${purchaseEndPoints.removePurchaseDetails}/${Id}`
      );
      return response.data;
    },
  });
};

export const useGetPurchaseById = (purchaseId: string) => {
  return useQuery({
    queryKey: [queryKey, purchaseId],
    queryFn: async (): Promise<IPurchase> => {
      if (!purchaseId) {
        throw new Error("Id is required to get a purchaseDetails");
      }
      const response = await api.get<IPurchase>(
        `${purchaseEndPoints.getPurchaseDetailsById}/${purchaseId}`
      );
      return response.data;
    },
    enabled: !!purchaseId,
    staleTime: 0,
    retry: false,
  });
};

export const useEditPurchase = () => {
  return useMutation<
    IPurchase,
    Error,
    { id: string | unknown; data: purchaseRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IPurchase> => {
      if (!id) {
        throw new Error("Id is required to edit purchaseDetails");
      }
      const response = await api.patch(
        `${purchaseEndPoints.updatePurchaseDetails}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};

export const useEditBillNumberGenerationForPurchase = () => {
  return useMutation<
    IBillNumberGeneration,
    Error,
    { id: string | null; data: billNumberGenerationRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IBillNumberGeneration> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${purchaseEndPoints.updateBillNumberGenerationPurchase}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};
export const useGetBillNumberGeneration = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["billNumber"],
    queryFn: async () => {
      const response = await api.get(
        `${purchaseEndPoints.billNumberGeneration}/${CompanyId}`
      );
      return response.data;
    },
    retry: false,
  });
};
export const useGetTaxForPurchase = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["PurchaseForTax"],
    queryFn: async () => {
      const response = await api.get(
        `${purchaseEndPoints.getTaxForPurchase}/${CompanyId}`
      );
      return response.data;
    },
    retry: false,
  });
};
export const useEditTaxForPurchase = () => {
  return useMutation<
    ITaxForPurchase,
    Error,
    { id: string | null; data: taxForPurchaseRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ITaxForPurchase> => {
      if (!id) {
        throw new Error("Ïd is required to edit reference number generation");
      }
      const response = await api.patch(
        `${purchaseEndPoints.updateTaxForPurchase}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};

export const useGetReferenceNumberForPurchase = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["PurchaseReferenceNumber"],
    queryFn: async () => {
      const response = await api.get(
        `${purchaseEndPoints.referenceNumber}/${CompanyId}`
      );
      return response.data;
    },
    retry: false,
  });
};

export const useEditReferenceNumberForPurchase = () => {
  return useMutation<
    IReferenceGenerationForPurchase,
    Error,
    { id: string | null; data: referenceNumberGenerationRequest }
  >({
    mutationFn: async ({
      id,
      data,
    }): Promise<IReferenceGenerationForPurchase> => {
      if (!id) {
        throw new Error("Ïd is required to edit reference number generation");
      }
      const response = await api.patch(
        `${purchaseEndPoints.updateReferenceNumberGeneration}/${id}`,
        data
      );
      return response.data;
    },
    retry: false,
  });
};

export const useGetFilterPurchaseByDate = (
  startDate: string,
  endDate: string,
  ledgerId?: string | null
) => {
  return useQuery({
    queryKey: [queryKey, ledgerId, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !ledgerId) {
        throw new Error("StartDate and EndDate are required to get a Purchase");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ledgerId,
      });

      const response = await api.get<IPurchase[]>(
        `${purchaseEndPoints.filterPurchaseByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
export const useGetAllPurchaseItems = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${purchaseEndPoints.getallpurchaseItems}${params}`
        : `${purchaseEndPoints.getallpurchaseItems}`;
      const response = await api.get<IPaginationResponse<IPurchaseItems>>(url);
      return response.data;
    },
    retry: false,
  });
};
