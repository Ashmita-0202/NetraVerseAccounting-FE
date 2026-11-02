import { useEffect, useState } from "react";
import { ISubModules } from "../types/ISubModules";
import { useGetAllSubModules, useGetFilterSubModulesByDate } from "../hooks";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useRemoveSubModule } from "../hooks";
import Pagination from "@/hooks/pagination";
import { ButtonElement } from "@/components/FormComponents/Button";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import EditSubModule from "../pages/Edit";
import { EditButton } from "@/components/common/EditButton";
import { IFilterSubModulesByDate } from "../types/ISubModules";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterSubModulesForm from "./FilterSubModulesForm";
const AllSubModuleForm = () => {
  const [modal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowModal(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const [state, setState] = useState({
    loading: true,
    subModules: [] as ISubModules[],
    errorMessage: "",
  });
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
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
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const query = `?pagesize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allSubModules, error, refetch } = useGetAllSubModules(query);

  const form = useForm<IFilterSubModulesByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterSubModulesByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterSubModules } = useGetFilterSubModulesByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [SubModules, setSubModules] = useState<
    IPaginationResponse<ISubModules> | ISubModules[] | undefined
  >(allSubModules);
  useEffect(() => {
    if (filterSubModules && filterSubModules?.length > 0) {
      setSubModules(filterSubModules);
    } else {
      setSubModules(allSubModules);
    }
  }, [filterSubModules, allSubModules]);

  const getSubModulesArray = (): ISubModules[] => {
    if (SubModules && "Items" in SubModules) {
      return SubModules.Items;
    } else if (Array.isArray(SubModules)) {
      return SubModules;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      subModules: getSubModulesArray(),
      errorMessage: error ? "Failed to fetch SubModules" : "",
    });
  }, [SubModules, error]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const deleteSubModule = useRemoveSubModule();
  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteSubModule.mutateAsync(id);
      refetch();
    } catch (error) {
      console.log("Error Deleting: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [paginationParams]);

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, subModules: [] });
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
      className="p-4"
    >
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      {(allSubModules?.Items || []).length > 0 && (
        <FilterSubModulesForm form={form} setFormData={setFormData} />
      )}
      <table
        style={{
          minWidth: "600px",
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              SN
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Name
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              IconUrl
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              TargetUrl
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Rank
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {state?.subModules?.length > 0 ? (
            state?.subModules?.map((subModule: ISubModules, index: number) => (
              <tr key={index}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {subModule.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {subModule.iconUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {subModule.targetUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {subModule.rank}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <div className="flex space-x-2">
                    <DeleteButton
                      handleDelete={() => handleDelete(subModule.id)}
                      isLoading={isLoading}
                    />
                    <EditButton button={buttonElement(subModule.id ?? "")} />
                    {selectedId && selectedId !== "" && (
                      <EditSubModule
                        visible={modal}
                        onClose={() => setShowModal(false)}
                        subModulesId={selectedId}
                        currentPageIndex={paginationParams.pageIndex}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              ></td>
            </tr>
          )}
        </tbody>
      </table>
      {state?.subModules?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(SubModules)
              ? 1
              : SubModules?.PageIndex ?? 1,
            firstPage: Array.isArray(SubModules)
              ? 1
              : SubModules?.FirstPage ?? 1,
            lastPage: Array.isArray(SubModules) ? 1 : SubModules?.LastPage ?? 1,
            nextPage: Array.isArray(SubModules) ? 1 : SubModules?.NextPage ?? 1,
            previousPage: Array.isArray(SubModules)
              ? 1
              : SubModules?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};
export default AllSubModuleForm;
