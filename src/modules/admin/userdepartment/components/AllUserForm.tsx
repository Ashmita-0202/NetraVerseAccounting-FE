import { useEffect, useState } from "react";
import {
  useDeleteUser,
  useGetAllUsers,
  useGetFilterUserByDate,
} from "../hooks";
import { IUserResponse } from "../types/IUserResponse";
import Pagination from "@/hooks/pagination";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import EditUser from "../pages/Edit";
import { Edit, UserRoundPen } from "lucide-react";
import AssignRoleForm from "@/modules/admin/userdepartment/components/AssignRoleForm";
import AssignedRoles from "@/modules/admin/userdepartment/components/AssignedRoles";
import "../../../../App.css";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "../../rolesmodules/hooks/useMenuPermissionData";
import { IFilterUserByDate } from "../types/IUserResponse";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterUserForm from "./FilterUserForm";

const AllUserForm = () => {
  const [modal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdForAssignRole, setSelectedIdForAssignRole] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [modalForAssignRole, setModalForAssignRole] = useState(false);
  const { menuStatus } = usePermissions();
  const { canDelete, canEdit, canAssign } = useMenuPermissionData(menuStatus);
  const buttonElement = (userId: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowModal(true);
          setSelectedUserId(userId);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  const [state, setState] = useState({
    loading: true,
    users: [] as IUserResponse[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 3,
    pageIndex: 1,
    isPagination: true,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const { refetch, data: allUser, error } = useGetAllUsers(query);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const form = useForm<IFilterUserByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      userName: "",
    },
  });
  const [formData, setFormData] = useState<IFilterUserByDate>({
    startDate: "",
    endDate: "",
    userName: "",
  });
  const { data: filterUser } = useGetFilterUserByDate(
    formData.startDate,
    formData.endDate,
    formData.userName
  );
  const [User, setUser] = useState<
    IPaginationResponse<IUserResponse> | IUserResponse[] | undefined
  >(allUser);
  useEffect(() => {
    if (filterUser && filterUser?.length > 0) {
      setUser(filterUser);
    } else {
      setUser(allUser);
    }
  }, [filterUser, allUser]);

  const getUserArray = (): IUserResponse[] => {
    if (User && "Items" in User) {
      return User.Items;
    } else if (Array.isArray(User)) {
      return User;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      users: getUserArray(),
      errorMessage: error ? "Failed to fetch User" : "",
    });
  }, [User, error]);

  type SearchParams = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const deleteUser = useDeleteUser();
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteUser.mutateAsync(id);
      refetch();
    } catch (error) {
      console.log("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAssignRole = (userId: string) => {
    setSelectedIdForAssignRole((prev) => {
      const newSelectedId = prev === userId ? "" : userId;
      setModalForAssignRole(newSelectedId !== "");
      return newSelectedId;
    });
  };

  const handleSubmit = useForm<SearchParams>({
    defaultValues: {},
  });

  useEffect(() => {
    refetch();
  }, [paginationParams]);

  const handleSearch = (params: SearchParams) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, users: [] });
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
      className="p-4"
    >
      {error && <p className="text-red-500 text-center">{error.message}</p>}

      {(allUser?.Items || []).length > 0 && (
        <FilterUserForm form={form} setFormData={setFormData} />
      )}

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse mb-4"
          style={{
            minWidth: "600px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border-b-2">SN</th>
              <th className="p-3 border-b-2">USERNAME</th>
              <th className="p-3 border-b-2">EMAIL</th>
              <th className="p-3 border-b-2">ROLES</th>
              <th className="p-3 border-b-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {state?.users?.length > 0 ? (
              state.users.map((users: IUserResponse, index: number) => (
                <tr
                  key={users.Id}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{users.UserName}</td>
                  <td className="p-3 border-b">{users.Email}</td>
                  <td className="p-3 border-b">
                    <AssignedRoles userId={users.Id} />
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex space-x-2">
                      <div className="tooltip">
                        {canDelete && (
                          <div>
                            <span className="tooltiptext">Delete User</span>
                            <DeleteButton
                              handleDelete={() => handleDelete(users.Id)}
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                      </div>
                      <div className="tooltip">
                        {canEdit && (
                          <div>
                            <span className="tooltiptext">Edit User</span>
                            <EditButton
                              button={buttonElement(users.Id ?? "")}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex">
                        {canAssign && (
                          <div className="tooltip">
                            <span className="tooltiptext">Assign Role</span>
                            <ButtonElement
                              icon={<UserRoundPen size={14} />}
                              type="button"
                              text=""
                              onClick={() => {
                                handleAssignRole(users.Id);
                              }}
                              className="!text-xs font-bold !bg-teal-500"
                            />
                          </div>
                        )}
                      </div>
                      {selectedIdForAssignRole === users.Id &&
                        modalForAssignRole && (
                          <div className="">
                            <AssignRoleForm
                              userId={users.Id}
                              key={selectedIdForAssignRole}
                              onClose={() => {
                                setModalForAssignRole(false);
                                setSelectedIdForAssignRole("");
                              }}
                              visible={modalForAssignRole}
                            />
                          </div>
                        )}
                      {selectedUserId && selectedUserId !== "" && (
                        <EditUser
                          visible={modal}
                          onClose={() => setShowModal(false)}
                          userId={selectedUserId}
                          currentPageIndex={paginationParams.pageIndex}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-3 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {state?.users?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(User) ? 1 : User?.PageIndex ?? 1,
            firstPage: Array.isArray(User) ? 1 : User?.FirstPage ?? 1,
            lastPage: Array.isArray(User) ? 1 : User?.LastPage ?? 1,
            nextPage: Array.isArray(User) ? 1 : User?.NextPage ?? 1,
            previousPage: Array.isArray(User) ? 1 : User?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default AllUserForm;
