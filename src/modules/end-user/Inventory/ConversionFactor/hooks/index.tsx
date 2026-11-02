import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IConversionFactor } from "../types/IConversionFactor";
const ConversionFactorEndPoints = {
  getAllConversionFactor: "/api/InventoryControllers/all-ConversionFactor",
  createConversionFactor: "/api/InventoryControllers/AddConversionFactor",
  removeConversionFactor: "/api/InventoryControllers/DeleteConversionFactor",
  updateConversionFactor: "/api/InventoryControllers/UpdateConversionFactor",
  getConversionFactorById: "/api/InventoryControllers/ConversionFactor",
  filterConversionFactorByDate:
    "/api/InventoryControllers/FilterConversionFactor",
};

const queryKey = "ConversionFactor";

type ConversionFactorRequest = {
  id?: string;
  fromUnit: string;
  toUnit: string;
  name: string;
  conversionFactor: number | null;
};

export const useGetAllConversionFactor = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${ConversionFactorEndPoints.getAllConversionFactor}${params}`
        : `${ConversionFactorEndPoints.getAllConversionFactor}`;
      const response = await api.get<IPaginationResponse<IConversionFactor>>(
        url
      );
      return response.data;
    },
  });
};

export const useAddConversionFactor = () => {
  const queryClient = useQueryClient();
  return useMutation<IConversionFactor, Error, ConversionFactorRequest>({
    mutationFn: async (
      data: ConversionFactorRequest
    ): Promise<IConversionFactor> => {
      const response = await api.post(
        ConversionFactorEndPoints.createConversionFactor,
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
      console.log("Error adding ConversionFactor", error);
    },
  });
};
export const useRemoveConversionFactor = () => {
  return useMutation<IConversionFactor, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IConversionFactor> => {
      if (!Id) {
        throw new Error("Id is required to delete a  Conversion factor");
      }
      const response = await api.delete(
        `${ConversionFactorEndPoints.removeConversionFactor}/${Id}`
      );
      return response.data;
    },
  });
};

export const useEditConversionFactor = () => {
  return useMutation<
    IConversionFactor,
    Error,
    { id: number | unknown; data: ConversionFactorRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IConversionFactor> => {
      if (!id) {
        throw new Error("Id is required to edit a Conversion factor");
      }
      const response = await api.patch(
        `${ConversionFactorEndPoints.updateConversionFactor}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetConversionFactorById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get<IConversionFactor>(
        `${ConversionFactorEndPoints.getConversionFactorById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetFilterConversionFactorByDate = (
  startDate: string,
  endDate: string,
  fromUnit: string | null
) => {
  return useQuery({
    queryKey: [queryKey, fromUnit, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !fromUnit) {
        throw new Error(
          "StartDate and EndDate are required to get a ConversionFactor"
        );
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        fromUnit,
      });

      const response = await api.get<IConversionFactor[]>(
        `${
          ConversionFactorEndPoints.filterConversionFactorByDate
        }?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
