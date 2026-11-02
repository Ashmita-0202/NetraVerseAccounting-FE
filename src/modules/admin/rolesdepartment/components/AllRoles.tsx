import { useEffect, useState } from "react";
import { IRoles } from "../types/IRoles";
import { useNavigate } from "react-router-dom";
import { useGetAllRoles, useGetFilterRoleByDate } from "../hooks";
import { useForm } from "react-hook-form";

import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useRemoveRole } from "../hooks";
import { Box, Boxes, Edit, FileLock, SquareMenu } from "lucide-react";
import All from "../assignrole/pages/All";
import AssignModuleForm from "./AssignModuleForm";
import AssignMenuForm from "./AssignMenuForm";
import AssignSubModuleForm from "./AssignSubModuleForm";
import EditRole from "../pages/Edit";
import "../../../../App.css";
import AssignedUser from "./AssignedUser";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "../../rolesmodules/hooks/useMenuPermissionData";
import Pagination from "@/hooks/pagination";
import { IFilterRoleByDate } from "../types/IRoles";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterRoleForm from "./FIlterRoleForm";

const AllRoleForm = () => {
  const [state, setState] = useState({
    loading: true,
    roles: [] as IRoles[],
    errorMessage: "",
  });
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAssign } = useMenuPermissionData(menuStatus);
  const [modal, setShowModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedIdEdit, setSelectedIdEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [modalForAssignModule, setModalForAssignModule] = useState(false);
  const [selectedIdForAssignModule, setSelectedIdForAssignModule] =
    useState("");
  const [modalForSubModule, setModalForSubModule] = useState(false);
  const [selectedIdForSubModule, setSelectedIdForSubModule] = useState("");
  const [modalForMenu, setModalForMenu] = useState(false);
  const [selectedIdForMenu, setSelectedIdForMenu] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
    pageIndex: 1,
    isPagination: true,
  });

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const { data: allRole, error, refetch } = useGetAllRoles(query);
  const form = useForm<IFilterRoleByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterRoleByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterRole } = useGetFilterRoleByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Role, setRole] = useState<
    IPaginationResponse<IRoles> | IRoles[] | undefined
  >(allRole);
  useEffect(() => {
    if (filterRole && filterRole?.length > 0) {
      setRole(filterRole);
    } else {
      setRole(allRole);
    }
  }, [filterRole, allRole]);

  const getRoleArray = (): IRoles[] => {
    if (Role && "Items" in Role) {
      return Role.Items;
    } else if (Array.isArray(Role)) {
      return Role;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      roles: getRoleArray(),
      errorMessage: error ? "Failed to fetch Role" : "",
    });
  }, [Role, error]);

  type SearchParams = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const handleSubmit = useForm<SearchParams>({
    defaultValues: {},
  });
  const deleteRole = useRemoveRole();
  const handleDelete = async (Id: string) => {
    setLoading(true);
    try {
      await deleteRole.mutateAsync(Id);
      refetch();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setSelectedIdEdit(id);
          setModalEdit(true);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleSearch = (params: SearchParams) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, roles: [] });
  };

  const handleAssignModule = (roleId: string) => {
    setSelectedIdForAssignModule(
      selectedIdForAssignModule === roleId ? "" : roleId
    );
    setModalForAssignModule(selectedIdForAssignModule !== roleId);
  };

  const handleAssignSubModule = (roleId: string) => {
    setSelectedIdForSubModule(selectedIdForSubModule === roleId ? "" : roleId);
    setModalForSubModule(selectedIdForSubModule !== roleId);
  };

  const handleAssignMenu = (roleId: string) => {
    setSelectedIdForMenu(selectedIdForMenu === roleId ? "" : roleId);
    setModalForMenu(selectedIdForMenu !== roleId);
  };

  const handleGrantPermission = (roleId: string) => {
    setSelectedId(selectedId === roleId ? "" : roleId);
    setShowModal(selectedId !== roleId);
  };

  return (
    <div style={{ margin: "15px" }}>
      {state.loading && (
        <p className="text-center text-blue-500">Loading roles...</p>
      )}
      {(allRole?.Items || []).length > 0 && (
        <FilterRoleForm form={form} setFormData={setFormData} />
      )}
      <table
        className="w-full border-collapse mb-4"
        style={{
          minWidth: "600px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              SN
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              ROLE NAME
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              ASSIGNED USERS
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              ACTION
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              ASSIGN TO
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              MODULE PERMISSION
            </th>
          </tr>
        </thead>
        <tbody>
          {state?.roles?.length > 0 ? (
            state?.roles
              .filter((role): role is IRoles => role !== undefined)
              .map((role: IRoles, index: number) => (
                <tr
                  key={index}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } `}
                >
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{role?.Name}</td>
                  <td className="p-3 border-b">
                    <AssignedUser roleId={role?.Id} />
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex space-x-2">
                      {canDelete && (
                        <div className="tooltip">
                          <span className="tooltiptext">Delete Role</span>
                          <DeleteButton
                            handleDelete={() => handleDelete(role?.Id)}
                            isLoading={loading}
                          />
                        </div>
                      )}
                      {canEdit && (
                        <div className="tooltip">
                          <span className="tooltiptext">Edit Role</span>
                          <EditButton button={buttonElement(role?.Id ?? "")} />
                          {selectedIdEdit && selectedIdEdit !== " " && (
                            <EditRole
                              currentPageIndex={paginationParams.pageIndex}
                              visible={modalEdit}
                              onClose={() => setModalEdit(false)}
                              Id={selectedIdEdit}
                              roleId={selectedIdEdit}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex space-x-2 ">
                      <div className="tooltip">
                        <span className="tooltiptext">Assign Modules</span>
                        <ButtonElement
                          icon={<Box size={14} />}
                          type="button"
                          text=""
                          onClick={() => {
                            handleAssignModule(role?.Id);
                            if (modal) {
                              setShowModal(false);
                            }
                            if (modalForSubModule) {
                              setModalForSubModule(false);
                            }
                            if (modalForMenu) {
                              setModalForMenu(false);
                            }
                          }}
                          className="!text-xs font-bold !bg-teal-500"
                        />
                      </div>

                      <div className="tooltip">
                        <span className="tooltiptext">Assign Sub Modules</span>
                        <ButtonElement
                          icon={<Boxes size={14} />}
                          type="button"
                          text=""
                          onClick={() => {
                            if (modal) {
                              setShowModal(false);
                            }
                            handleAssignSubModule(role?.Id);
                            if (modalForAssignModule) {
                              setModalForAssignModule(false);
                            }
                            if (modalForMenu) {
                              setModalForMenu(false);
                            }
                          }}
                          className="!text-xs font-bold !bg-teal-500"
                        />
                      </div>

                      <div className="tooltip">
                        <span className="tooltiptext">Assign Menu</span>
                        <ButtonElement
                          icon={<SquareMenu size={14} />}
                          type="button"
                          text=""
                          onClick={() => {
                            if (modal) {
                              setShowModal(false);
                            }
                            handleAssignMenu(role?.Id);
                            if (modalForAssignModule) {
                              setModalForAssignModule(false);
                            }
                            if (modalForSubModule) {
                              setModalForSubModule(false);
                            }
                          }}
                          className="!text-xs font-bold !bg-teal-500"
                        />
                      </div>
                    </div>
                    {selectedIdForAssignModule === role?.Id &&
                      modalForAssignModule && (
                        <div className="ml-8">
                          <AssignModuleForm
                            key={selectedIdForAssignModule}
                            roleId={role?.Id}
                            refetchRoles={refetch}
                            onClose={() => {
                              setModalForAssignModule(false);
                            }}
                            visible={modalForAssignModule}
                          />
                        </div>
                      )}
                    {selectedIdForSubModule === role?.Id &&
                      modalForSubModule && (
                        <div className="ml-16 ">
                          <AssignSubModuleForm
                            key={selectedIdForSubModule}
                            roleId={role?.Id}
                            refetchRoles={refetch}
                            onClose={() => {
                              setModalForSubModule(false);
                            }}
                            visible={modalForSubModule}
                          />
                        </div>
                      )}
                    {selectedIdForMenu === role?.Id && modalForMenu && (
                      <div className="ml-28">
                        <AssignMenuForm
                          key={selectedIdForMenu}
                          roleId={role?.Id}
                          refetchRoles={refetch}
                          onClose={() => {
                            setModalForMenu(false);
                          }}
                          visible={modalForMenu}
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {canAssign && (
                      <div className="tooltip">
                        <span className="tooltiptext ">Grant Permission</span>
                        <ButtonElement
                          icon={<FileLock size={14} />}
                          type="button"
                          text=""
                          onClick={() => {
                            handleGrantPermission(role?.Id);
                            if (modalForAssignModule) {
                              setModalForAssignModule(false);
                            }
                            if (modalForSubModule) {
                              setModalForSubModule(false);
                            }
                            if (modalForMenu) {
                              setModalForMenu(false);
                            }
                          }}
                          className="!text-xs font-bold !bg-teal-500"
                        />
                      </div>
                    )}

                    {selectedId === role?.Id && modal && (
                      <div className="ml-8">
                        <All
                          key={selectedId}
                          roleId={selectedId}
                          onClose={() => {
                            setShowModal(false);
                            setSelectedId("");
                          }}
                          visible={modal}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={3} style={{ padding: "12px", textAlign: "center" }}>
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {state?.roles?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(Role) ? 1 : Role?.PageIndex ?? 1,
            firstPage: Array.isArray(Role) ? 1 : Role?.FirstPage ?? 1,
            lastPage: Array.isArray(Role) ? 1 : Role?.LastPage ?? 1,
            nextPage: Array.isArray(Role) ? 1 : Role?.NextPage ?? 1,
            previousPage: Array.isArray(Role) ? 1 : Role?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default AllRoleForm;
