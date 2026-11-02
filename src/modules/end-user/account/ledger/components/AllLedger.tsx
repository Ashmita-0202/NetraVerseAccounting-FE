import { useEffect, useRef, useState } from "react";
import {
  useGetAllLedgers,
  useRemoveLedger,
  useGetFilterLedgerByDate,
} from "../hooks";
import { ILedgers, IFilterLedgerByDate } from "../types/ILedgers";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import Pagination from "@/hooks/pagination";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import { EditButton } from "@/components/common/EditButton";
import EditLedger from "../pages/Edit";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterLedgerForm from "./FIlterLedgerForm";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllLedgerForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: true,
    ledgers: [] as ILedgers[],
    errorMessage: "",
  });
  const [showLedger, setShowLedger] = useState(false);
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const [selectedId, setSelectedId] = useState<string>("");

  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowLedger(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

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
    updateState({ loading: true, ledgers: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const {
    data: allLedger,
    error,
    refetch,
    isLoading: allLedgersLoading,
    isFetching,
  } = useGetAllLedgers(query);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { mutateAsync: deleteLedger } = useRemoveLedger();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<IFilterLedgerByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterLedgerByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterLedger } = useGetFilterLedgerByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Ledger, setLedger] = useState<
    IPaginationResponse<ILedgers> | ILedgers[] | undefined
  >(allLedger);
  useEffect(() => {
    if (filterLedger && filterLedger?.length > 0) {
      setLedger(filterLedger);
    } else {
      setLedger(allLedger);
    }
  }, [filterLedger, allLedger]);

  const getLedgerArray = (): ILedgers[] => {
    if (Ledger && "Items" in Ledger) {
      return Ledger.Items;
    } else if (Array.isArray(Ledger)) {
      return Ledger;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      ledgers: getLedgerArray(),
      errorMessage: error ? "Failed to fetch Ledger" : "",
    });
  }, [Ledger, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteLedger(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
          .save("Ledger.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };

  const handleExportExcel = async () => {
    if (state.ledgers.length === 0) {
      alert("No ledgers to export.");
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
      const allLedgers = state.ledgers;

      if (allLedgers.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(allLedgers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ledgers");

        XLSX.writeFile(workbook, "Ledgers.xlsx");

        setPaginationParams(originalPaginationParams);
      } else {
        alert("No data to export.");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data.");
    }
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

      const parsedData: ILedgers[] = XLSX.utils.sheet_to_json(sheet);
      setState((prev) => ({
        ...prev,
        ledgers: [...prev.ledgers, ...parsedData],
      }));

      alert("CSV file imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      {allLedgersLoading ||
        (isFetching && (
          <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ))}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {(allLedger?.Items || []).length > 0 && (
        <FilterLedgerForm form={form} setFormData={setFormData} />
      )}

      <div ref={tableRef}>
        {state.ledgers.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("SN")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Name")}
                </th>
                {!isPrinting && (
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                    {t("Actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {state.ledgers.map((ledger: ILedgers, index: number) => (
                <tr
                  key={index}
                  className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                >
                  <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {ledger.name}
                  </td>
                  {!isPrinting && (
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <div className="flex space-x-2">
                        {canEdit && (
                          <div>
                            <EditButton
                              button={buttonElement(ledger.id ?? "")}
                            />
                          </div>
                        )}

                        {canDelete && (
                          <div>
                            <DeleteButton
                              handleDelete={() => handleDelete(ledger.id)}
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                        {selectedId && selectedId !== "" && (
                          <EditLedger
                            visible={showLedger}
                            onClose={() => setShowLedger(false)}
                            ledgerId={selectedId}
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
          <p className="text-center text-sm text-gray-500">No ledgers found.</p>
        )}
      </div>

      {state.ledgers.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Ledger) ? 1 : Ledger?.PageIndex ?? 1,
              firstPage: Array.isArray(Ledger) ? 1 : Ledger?.FirstPage ?? 1,
              lastPage: Array.isArray(Ledger) ? 1 : Ledger?.LastPage ?? 1,
              nextPage: Array.isArray(Ledger) ? 1 : Ledger?.NextPage ?? 1,
              previousPage: Array.isArray(Ledger)
                ? 1
                : Ledger?.PreviousPage ?? 1,
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
            {t("Export")}
          </option>
          <option value="pdf" className="bg-white text-black">
            {t("Print as PDF")}
          </option>
          <option value="excel" className="bg-white text-black">
            {t("Export as Excel")}
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
          <span>{t("Upload CSV")}</span>
        </label>
      </div>
    </div>
  );
};

export default AllLedgerForm;
