import { api } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";
import { IVatDetails } from "../types/IVatDetails";
import { IPaginationResponse } from "@/types/IPaginationResponse";
const VatDetailsEndPoints = {
  getVatDetails: "/api/Report/GetVATDetails",
};
const queryKey = "VatDetails";
export const useGetVatDetails = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],

    queryFn: async () => {
      const url = params
        ? `${VatDetailsEndPoints.getVatDetails}${params}`
        : `${VatDetailsEndPoints.getVatDetails}`;
      const response = await api.get<IPaginationResponse<IVatDetails>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
