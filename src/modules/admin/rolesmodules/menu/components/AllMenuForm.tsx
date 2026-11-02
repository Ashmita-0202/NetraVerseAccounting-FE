import { useEffect, useState } from "react";
import { IMenu } from "../types/IMenu";
import { useGetAllMenus, useGetFilterMenusByDate } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRemoveMenu } from "../hooks";
import Pagination from "@/hooks/pagination";
import { ButtonElement } from "@/components/FormComponents/Button";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import EditMenu from "../pages/Edit";
import { EditButton } from "@/components/common/EditButton";
import { IFilterMenusByDate } from "../types/IMenu";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterMenusForm from "./FilterMenuForm";
const AllMenuForm = () => {
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
    menus: [] as IMenu[],
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
  const { data: allMenus, error, refetch } = useGetAllMenus(query);
  const form = useForm<IFilterMenusByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterMenusByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterMenus } = useGetFilterMenusByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Menus, setMenus] = useState<
    IPaginationResponse<IMenu> | IMenu[] | undefined
  >(allMenus);
  useEffect(() => {
    if (filterMenus && filterMenus?.length > 0) {
      setMenus(filterMenus);
    } else {
      setMenus(allMenus);
    }
  }, [filterMenus, allMenus]);

  const getMenusArray = (): IMenu[] => {
    if (Menus && "Items" in Menus) {
      return Menus.Items;
    } else if (Array.isArray(Menus)) {
      return Menus;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      menus: getMenusArray(),
      errorMessage: error ? "Failed to fetch Menus" : "",
    });
  }, [Menus, error]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const deleteMenu = useRemoveMenu();
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteMenu.mutateAsync(id);
      const updatedMenus = state.menus.filter((menu) => menu.id !== id);
      updateState({ menus: updatedMenus });
    } catch (error) {
      console.log("Error deleting: ", error);
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
    updateState({ loading: true, menus: [] });
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
      className="p-4"
    >
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      {(allMenus?.Items || []).length > 0 && (
        <FilterMenusForm form={form} setFormData={setFormData} />
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
              TargetUrl
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
          {state?.menus?.length > 0 ? (
            state?.menus?.map((menu: IMenu, index: number) => (
              <tr key={index}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {menu.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {menu.targetUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {menu.iconUrl}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {menu.rank}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <div className="flex space-x-2">
                    <DeleteButton
                      handleDelete={() => handleDelete(menu.id)}
                      isLoading={isLoading}
                    />
                    <EditButton button={buttonElement(menu.id ?? "")} />
                    {selectedId && selectedId !== "" && (
                      <EditMenu
                        visible={modal}
                        onClose={() => setShowModal(false)}
                        menuId={selectedId}
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
      {state?.menus?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(Menus) ? 1 : Menus?.PageIndex ?? 1,
            firstPage: Array.isArray(Menus) ? 1 : Menus?.FirstPage ?? 1,
            lastPage: Array.isArray(Menus) ? 1 : Menus?.LastPage ?? 1,
            nextPage: Array.isArray(Menus) ? 1 : Menus?.NextPage ?? 1,
            previousPage: Array.isArray(Menus) ? 1 : Menus?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};
export default AllMenuForm;
