import { IPaginationResponse } from "@/types/IPaginationResponse";
import { apiRoutes } from "@/utils/apiRoutes";
import { api } from "@/utils/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAssign, IUserResponse } from "../types/IUserResponse";
// import { promises } from "dns";

const queryKey = "userdepartments";

type userRequest = {
  Id: string;
  UserName: string;
  Email: string;
  Password: string;
  rolesId: string[];
  InstitutionId: string;
  companyIds: string[];
};
type roleRequest = {
  userId: string;
  rolesId: string[];
};
export const useGetAllUsers = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${apiRoutes.allUser}${params}`
        : `${apiRoutes.allUser}`;

      const response = await api.get<IPaginationResponse<IUserResponse>>(url);
      return response.data;
    },
  });
};

export const useEditUser = (Id: string) => {
  return useMutation<IUserResponse, Error, userRequest>({
    mutationFn: async (data: userRequest): Promise<IUserResponse> => {
      if (!Id) {
        throw new Error("Id is required to edit a role");
      }
      const response = await api.patch(`${apiRoutes.editUser}/${Id}`, data);
      return response.data;
    },
  });
};

export const useGetUserById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get<IUserResponse>(
        `${apiRoutes.userById}/${Id}`
      );
      return response.data;
    },
  });
};
export const useGetUserByRoleId = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get<IUserResponse[]>(
        `${apiRoutes.userByRoleId}/${Id}`
      );
      return response.data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation<IUserResponse, Error, string>({
    mutationFn: async (Id: string): Promise<IUserResponse> => {
      if (!Id) {
        throw new Error("Id is required to edit a role");
      }
      const response = await api.delete(`${apiRoutes.deleteUser}/${Id}`);
      return response.data;
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserResponse, Error, userRequest>({
    mutationFn: async (data: userRequest): Promise<IUserResponse> => {
      const response = await api.post(apiRoutes.addUsers, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      console.log("Error adding user:", error);
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation<IAssign, Error, { userId: string; rolesId: string[] }>({
    mutationFn: async (data: roleRequest): Promise<IAssign> => {
      const response = await api.post(apiRoutes.assignRoles, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.refetchQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      console.log("error Assigning role", error);
    },
  });
};

export const useGetFilterUserByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("StartDate and EndDate are required to get a User");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });

      const response = await api.get<IUserResponse[]>(
        `${apiRoutes.filterUserByDate}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
