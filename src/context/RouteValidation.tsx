import { api } from "@/utils/instance";
import { redirect } from "react-router-dom";

interface Role {
  Id: string;
  Name: string;
}

interface RolesResponse {
  Items: Role[];
}

export const FetchRoles = async () => {
  const response = await api.get<RolesResponse>(
    "/api/Authentication/all-roles"
  );
  return await response.data;
};

export const RouteValidation = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("Roles", role);

  if (!token || !role) {
    throw redirect("/login");
  }
  const roles: RolesResponse = await FetchRoles();

  const allowedRoles = roles?.Items?.map((role): unknown => role.Name);

  console.log("allowedRoles", allowedRoles);
  if (allowedRoles && !allowedRoles.includes(role)) {
    throw redirect("/access-denied");
  }
  return null;
};
