import { useEffect, useRef, useState } from "react";
import { IReceipts } from "../types/IReceipts";
// import { useForm } from "react-hook-form";
// import Pagination from "@/hooks/pagination";
import React from "react";
import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
// import { usePermissions } from "@/context/auth/PermissionContext";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import EditReceipts from "../pages/Edit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { useGetAllReceipts, useRemoveReceipt } from "../hooks";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllReceiptsForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 50,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: true,
    Receipts: [] as IReceipts[],
    errorMessage: "",
  });
  // type SearchParam = {
  //   pageSize: number;
  //   pageIndex: number;
  //   isPagination: boolean;
  // };
  // const updateState = (updates: Partial<typeof state>) => {
  //   setState((prev) => ({ ...prev, ...updates }));
  // };
  // const handleSearch = (params: SearchParam) => {
  //   params.pageSize = paginationParams.pageSize;
  //   setPaginationParams(params);
  //   updateState({ loading: true, Receipts: [] });
  // };

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  // const handleSubmit = useForm<SearchParam>({
  //   defaultValues: {},
  // });
  const { mutateAsync: deleteReceipts } = useRemoveReceipt();
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: allReceipt,
    error,
    refetch,
    isLoading: fetchLoading,
  } = useGetAllReceipts(query);
  const allReceipts: IReceipts[] =
    allReceipt?.Items.filter((item: IReceipts) => item.transactionMode === 3) ||
    [];
  // const { menuStatus } = usePermissions();
  const tableRef = useRef<HTMLDivElement | null>(null);
  // const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const [isPrinting, setIsPrinting] = useState(false);
  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteReceipts(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const { t } = useTranslation();
  const getReceiptsArray = (): IReceipts[] => allReceipts;
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
          .save("ReceiptsDetails.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  const handleExportExcel = async () => {
    if (state.Receipts.length === 0) {
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
      const allLedgers = state.Receipts;

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

  useEffect(() => {
    setState({
      loading: false,
      Receipts: getReceiptsArray(),
      errorMessage: error ? "Failed to fetch Receipts" : "",
    });
  }, [error]);

  const [showReceipts, setShowReceipts] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowReceipts(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  return (
    <div className="p-4">
      {fetchLoading || state.loading ? (
        <div className="relative" style={{ minHeight: "50rem" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        </div>
      ) : (
        <div>
          {state.errorMessage && (
            <p className="text-center text-red-500">{state.errorMessage}</p>
          )}
          {state.errorMessage && (
            <p className="text-center text-red-500">{state.errorMessage}</p>
          )}
          <div ref={tableRef}>
            <div className="overflow-x-auto">
              {state.Receipts.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Date")}
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Total Amount")}
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Narration")}
                      </th>
                      {!isPrinting && (
                        <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                          {t("Actions")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {state?.Receipts.map((Receipts: IReceipts, index) => (
                      <React.Fragment key={index}>
                        <tr key={index}>
                          <td className="p-2 border">
                            {Receipts.transactionDate}
                          </td>
                          <td className="p-2 border">{Receipts.totalAmount}</td>
                          <td className="p-2 border">{Receipts.narration}</td>
                          {!isPrinting && (
                            <td className="p-2 border flex space-x-2">
                              {/* {canDelete && ( */}
                              <div>
                                <DeleteButton
                                  handleDelete={() => handleDelete(Receipts.id)}
                                  isLoading={isLoading}
                                />
                              </div>
                              {/* )}
                          {canEdit && ( */}
                              <div>
                                <EditButton
                                  button={buttonElement(Receipts.id ?? "")}
                                />
                              </div>
                              {/* )} */}
                            </td>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {t("No Receipts Found")}.
                </p>
              )}
            </div>
          </div>
          {selectedId && selectedId !== "" && (
            <EditReceipts
              visible={showReceipts}
              onClose={() => setShowReceipts(false)}
              ReceiptId={selectedId}
            />
          )}
          {/* {state.Receipts.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(allReceipts)
                ? 1
                : allReceipts?.PageIndex ?? 1,
              firstPage: Array.isArray(allReceipts)
                ? 1
                : allReceipts?.FirstPage ?? 1,
              lastPage: Array.isArray(allReceipts)
                ? 1
                : allReceipts?.LastPage ?? 1,
              nextPage: Array.isArray(allReceipts)
                ? 1
                : allReceipts?.NextPage ?? 1,
              previousPage: Array.isArray(allReceipts)
                ? 1
                : allReceipts?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )} */}
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
                {t("Export")}
              </option>
              <option value="pdf" className="bg-white text-black">
                {t("Print as PDF")}
              </option>
              <option value="excel" className="bg-white text-black">
                {t("Export as Excel")}
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReceiptsForm;
