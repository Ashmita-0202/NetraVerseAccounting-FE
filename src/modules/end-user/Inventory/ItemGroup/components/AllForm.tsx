import { useEffect, useRef, useState } from "react";
import {
  useGetAllItemGroup,
  useRemoveItemGroup,
  useGetFilterItemGroupByDate,
} from "../hooks";
import { IItemGroup } from "../types/IItemGroup";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import Pagination from "@/hooks/pagination";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditItemGroup from "../pages/Edit";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { IFilterItemGroupByDate } from "../types/IItemGroup";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterItemGroupForm from "./FilterItemGroupForm";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllItemGroupForm = () => {
  const { t } = useTranslation();
  const form = useForm<IFilterItemGroupByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [state, setState] = useState({
    loading: true,
    ItemGroup: [] as IItemGroup[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 45,
    pageIndex: 1,
    isPagination: true,
  });
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, ItemGroup: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allItemGroup, error, refetch } = useGetAllItemGroup(query);
  const { mutate: deleteItemGroup } = useRemoveItemGroup();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const [formData, setFormData] = useState<IFilterItemGroupByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterItemGroup } = useGetFilterItemGroupByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [ItemGroup, setItemGroup] = useState<
    IPaginationResponse<IItemGroup> | IItemGroup[] | undefined
  >(allItemGroup);
  useEffect(() => {
    if (filterItemGroup && filterItemGroup?.length > 0) {
      setItemGroup(filterItemGroup);
    } else {
      setItemGroup(allItemGroup);
    }
  }, [filterItemGroup, allItemGroup]);

  const getItemGroupArray = (): IItemGroup[] => {
    if (ItemGroup && "Items" in ItemGroup) {
      return ItemGroup.Items;
    } else if (Array.isArray(ItemGroup)) {
      return ItemGroup;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      ItemGroup: getItemGroupArray(),
      errorMessage: error ? "Failed to fetch ItemGroup" : "",
    });
  }, [ItemGroup, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string) => {
    {
      deleteItemGroup(id, {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          alert("Failed to delete ItemGroup.");
        },
      });
    }
  };
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

  useEffect(() => {
    if (selectedId) {
      setShowModal(true);
    }
  }, [selectedId]);

  const handlePrint = () => {
    const originalPaginationParams = { ...paginationParams };
    setPaginationParams({
      pageSize: 10000,
      pageIndex: 1,
      isPagination: false,
    });

    setIsPrinting(true);

    setTimeout(() => {
      if (tableRef.current) {
        html2pdf()
          .from(tableRef.current)
          .save("ItemsGroup.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };

  const handleExportExcel = async () => {
    if (state.ItemGroup.length === 0) {
      alert("No ItemsGroup to export.");
      return;
    }

    const originalPaginationParams = { ...paginationParams };
    setPaginationParams({
      pageSize: 10000,
      pageIndex: 1,
      isPagination: false,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const Itemgroup = state.ItemGroup;

      if (Itemgroup.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(Itemgroup);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ItemGroup");

        XLSX.writeFile(workbook, "ItemsGroup.xlsx");

        setPaginationParams(originalPaginationParams);
      } else {
        alert("No data to export.");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data.");
    }
  };

  return (
    <div className="p-4">
      {state.loading && (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {(allItemGroup?.Items || []).length > 0 && (
        <FilterItemGroupForm form={form} setFormData={setFormData} />
      )}
      <div ref={tableRef}>
        {state.ItemGroup.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("SN")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Item Group Name")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Description")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Is Primary")}
                </th>
                {!isPrinting && (
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                    {t("Actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {state.ItemGroup.map((ItemGroup: IItemGroup, index: number) => (
                <tr
                  key={index}
                  className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                >
                  <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {ItemGroup.name}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {ItemGroup.description}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {ItemGroup.isPrimary ? "Yes" : "No"}
                  </td>
                  {!isPrinting && (
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <div className="flex space-x-2 items-center justify-center">
                        {canDelete && (
                          <div>
                            <DeleteButton
                              handleDelete={() => handleDelete(ItemGroup.id)}
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                        {canEdit && (
                          <div>
                            <EditButton button={buttonElement(ItemGroup.id)} />
                          </div>
                        )}

                        {selectedId && selectedId !== "" && (
                          <EditItemGroup
                            visible={showModal}
                            onClose={() => setShowModal(false)}
                            ItemGroupId={selectedId}
                            currentPageIndex={paginationParams.pageIndex}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No ItemGroup found.
          </p>
        )}
      </div>
      {state.ItemGroup.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(ItemGroup)
                ? 1
                : ItemGroup?.PageIndex ?? 1,
              firstPage: Array.isArray(ItemGroup)
                ? 1
                : ItemGroup?.FirstPage ?? 1,
              lastPage: Array.isArray(ItemGroup) ? 1 : ItemGroup?.LastPage ?? 1,
              nextPage: Array.isArray(ItemGroup) ? 1 : ItemGroup?.NextPage ?? 1,
              previousPage: Array.isArray(ItemGroup)
                ? 1
                : ItemGroup?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
      <div className="flex justify-end  mt-4">
        <select
          onChange={(e) => {
            if (e.target.value === "pdf") {
              handlePrint();
            } else if (e.target.value === "excel") {
              handleExportExcel();
            }
          }}
          className="border rounded-md h-10 text-white bg-teal-500"
        >
          <option value="" className="bg-white text-black">
            Export
          </option>
          <option value="pdf" className="bg-white text-black">
            Print as PDF
          </option>
          <option value="excel" className="bg-white text-black">
            Export as Excel
          </option>
        </select>
      </div>
    </div>
  );
};

export default AllItemGroupForm;
