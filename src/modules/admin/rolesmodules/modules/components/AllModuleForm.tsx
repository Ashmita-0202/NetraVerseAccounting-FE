import { useEffect, useState } from "react";
import { IModules } from "../types/IModules";
import { useGetAllModules, useGetFilterModulesByDate } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import EditModule from "../pages/Edit";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useRemoveModule } from "../hooks";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import Pagination from "@/hooks/pagination";
import { IFilterModulesByDate } from "../types/IModules";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterModulesForm from "./FilterModuleForm";
const AllModuleForm = () => {
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
    modules: [] as IModules[],
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
  const { data: allModules, error, refetch } = useGetAllModules(query);
  const form = useForm<IFilterModulesByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterModulesByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterModules } = useGetFilterModulesByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Modules, setModules] = useState<
    IPaginationResponse<IModules> | IModules[] | undefined
  >(allModules);
  useEffect(() => {
    if (filterModules && filterModules?.length > 0) {
      setModules(filterModules);
    } else {
      setModules(allModules);
    }
  }, [filterModules, allModules]);

  const getModulesArray = (): IModules[] => {
    if (Modules && "Items" in Modules) {
      return Modules.Items;
    } else if (Array.isArray(Modules)) {
      return Modules;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      modules: getModulesArray(),
      errorMessage: error ? "Failed to fetch Modules" : "",
    });
  }, [Modules, error]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const deleteModule = useRemoveModule();

  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteModule.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, modules: [] });
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
      className="p-4"
    >
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      {(allModules?.Items || []).length > 0 && (
        <FilterModulesForm form={form} setFormData={setFormData} />
      )}

      <table
        className="w-full border-collapse mb-4 "
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
              Name
            </th>

            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              TargetURl
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              IconUrl
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
          {state?.modules?.length > 0 ? (
            state?.modules?.map((module: IModules, index: number) => (
              <tr key={index}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {module.Name}{" "}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {module.TargetUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {module.IconUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {module.Rank}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <div className="flex space-x-2">
                    <DeleteButton
                      handleDelete={() => handleDelete(module.Id)}
                      isLoading={isLoading}
                    />
                    <EditButton button={buttonElement(module.Id ?? "")} />

                    {selectedId && selectedId !== "" && (
                      <EditModule
                        visible={modal}
                        onClose={() => setShowModal(false)}
                        modulesId={selectedId}
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
                colSpan={4}
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

      {state?.modules?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(Modules) ? 1 : Modules?.PageIndex ?? 1,
            firstPage: Array.isArray(Modules) ? 1 : Modules?.FirstPage ?? 1,
            lastPage: Array.isArray(Modules) ? 1 : Modules?.LastPage ?? 1,
            nextPage: Array.isArray(Modules) ? 1 : Modules?.NextPage ?? 1,
            previousPage: Array.isArray(Modules)
              ? 1
              : Modules?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};
export default AllModuleForm;
