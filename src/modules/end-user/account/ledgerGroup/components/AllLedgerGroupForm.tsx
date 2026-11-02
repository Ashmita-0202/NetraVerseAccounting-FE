import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import {
  useGetAllLedgerGroups,
  useRemoveLedgerGroup,
  useGetFilterLedgerGroupByDate,
} from "../hooks";
import { ILedgerGroups } from "../types/ILedgerGroup";
import Pagination from "@/hooks/pagination";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditLedgerGroup from "../pages/Edit";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { IFilterLedgerGroupByDate } from "../types/ILedgerGroup";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterLedgerGroupForm from "./FilterLedgerGroupForm";
import ClipLoader from "react-spinners/ClipLoader";
const AllLedgerGroupForm = () => {
  const [state, setState] = useState({
    loading: true,
    LedgerGroups: [] as ILedgerGroups[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
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
    updateState({ loading: true, LedgerGroups: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allLedgerGroup, error, refetch } = useGetAllLedgerGroups(query);
  const { mutate: deleteLedgerGroup } = useRemoveLedgerGroup();
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const form = useForm<IFilterLedgerGroupByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterLedgerGroupByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterLedgerGroup } = useGetFilterLedgerGroupByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [LedgerGroup, setLedgerGroup] = useState<
    IPaginationResponse<ILedgerGroups> | ILedgerGroups[] | undefined
  >(allLedgerGroup);
  useEffect(() => {
    if (filterLedgerGroup && filterLedgerGroup?.length > 0) {
      setLedgerGroup(filterLedgerGroup);
    } else {
      setLedgerGroup(allLedgerGroup);
    }
  }, [filterLedgerGroup, allLedgerGroup]);

  const getLedgerGroupArray = (): ILedgerGroups[] => {
    if (LedgerGroup && "Items" in LedgerGroup) {
      return LedgerGroup.Items;
    } else if (Array.isArray(LedgerGroup)) {
      return LedgerGroup;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      LedgerGroups: getLedgerGroupArray(),
      errorMessage: error ? "Failed to fetch LedgerGroup" : "",
    });
  }, [LedgerGroup, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this LedgerGroup?")) {
      deleteLedgerGroup(id, {
        onSuccess: () => {
          refetch();
          alert("LedgerGroup deleted successfully.");
        },
        onError: () => {
          alert("Failed to delete LedgerGroup.");
        },
      });
    }
  };

  const buttonElement = (id: string) => (
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

  useEffect(() => {
    if (selectedId) {
      setShowModal(true);
    }
  }, [selectedId]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      if (tableRef.current) {
        html2pdf()
          .from(tableRef.current)
          .save("LedgerGroups.pdf")
          .finally(() => {
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  const handleExportExcel = () => {
    if (state.LedgerGroups.length === 0) {
      alert("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      state.LedgerGroups.map((ledgerGroup, index) => ({
        SN: index + 1,
        Name: ledgerGroup.name,
        "Is Custom": ledgerGroup.isCustom ? "Yes" : "No",
        "Is Primary": ledgerGroup.isPrimary ? "Yes" : "No",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LedgerGroups");

    XLSX.writeFile(workbook, "LedgerGroups.xlsx");
  };
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData: ILedgerGroups[] = XLSX.utils.sheet_to_json(sheet);

      setState((prev) => ({
        ...prev,
        ledgers: [...prev.LedgerGroups, ...parsedData],
      }));

      alert("CSV file imported successfully!");
    };

    reader.readAsArrayBuffer(file);
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

      {(allLedgerGroup?.Items || []).length > 0 && (
        <FilterLedgerGroupForm form={form} setFormData={setFormData} />
      )}
      <div ref={tableRef}>
        {state.LedgerGroups.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">SN</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  Name
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  Is Custom
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  Is Primary
                </th>
                {!isPrinting && (
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {state.LedgerGroups.map((LedgerGroup, index) => (
                <tr
                  key={index}
                  className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                >
                  <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {LedgerGroup.name}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {LedgerGroup.isCustom ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {LedgerGroup.isPrimary ? "Yes" : "No"}
                  </td>
                  {!isPrinting && (
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                      <div className="flex space-x-2 items-center justify-center">
                        {canDelete && (
                          <DeleteButton
                            handleDelete={() => handleDelete(LedgerGroup.id)}
                            isLoading={isLoading}
                          />
                        )}
                        {canEdit && (
                          <EditButton button={buttonElement(LedgerGroup.id)} />
                        )}
                        {selectedId && selectedId !== "" && (
                          <EditLedgerGroup
                            visible={showModal}
                            onClose={() => setShowModal(false)}
                            ledgerGroupId={selectedId}
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
            No LedgerGroups found.
          </p>
        )}
      </div>

      {state.LedgerGroups.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(LedgerGroup)
                ? 1
                : LedgerGroup?.PageIndex ?? 1,
              firstPage: Array.isArray(LedgerGroup)
                ? 1
                : LedgerGroup?.FirstPage ?? 1,
              lastPage: Array.isArray(LedgerGroup)
                ? 1
                : LedgerGroup?.LastPage ?? 1,
              nextPage: Array.isArray(LedgerGroup)
                ? 1
                : LedgerGroup?.NextPage ?? 1,
              previousPage: Array.isArray(LedgerGroup)
                ? 1
                : LedgerGroup?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <select
          onChange={(e) => {
            if (e.target.value === "pdf") {
              handlePrint();
            } else if (e.target.value === "excel") {
              handleExportExcel();
            }
          }}
          className="border rounded-md text-white bg-teal-500"
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

        <input
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
          id="csvUpload"
        />
        <label
          htmlFor="csvUpload"
          className="px-2 py-2 bg-teal-500 hover:bg-teal-700 cursor-pointer text-white font-medium rounded-lg shadow-md transition-all"
        >
          <span>Upload CSV</span>
        </label>
      </div>
    </div>
  );
};

export default AllLedgerGroupForm;
