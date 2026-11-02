import { useEffect, useRef, useState } from "react";
import { useGetAllJournals, useRemoveJournal } from "../hooks";
import Pagination from "@/hooks/pagination";
import { IFilterJournalByDate, IJournals } from "../types/IJournals";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { useGetAllLedgers } from "../../ledger/hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditJournal from "../pages/Edit";
import { useGetFilterJournalByDate } from "../hooks";
import FilterJournalForm from "./FilterJournalForm";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllJournalForm = () => {
  const { t } = useTranslation();
  const form = useForm<IFilterJournalByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      description: "",
    },
  });
  const [state, setState] = useState({
    loading: true,
    journals: [] as IJournals[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
    pageIndex: 1,
    isPagination: true,
  });
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const { refetch: refetchLedgers } = useGetAllLedgers();
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, journals: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allJournal, error, refetch } = useGetAllJournals(query);
  const { data: ledgerData } = useGetAllLedgers();
  const { mutateAsync: deleteJournal } = useRemoveJournal();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ledgers, setLedgers] = useState<{ [key: string]: string }>({});
  const { menuStatus } = usePermissions();
  const { canDelete, canEdit } = useMenuPermissionData(menuStatus);
  const tableRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<IFilterJournalByDate>({
    startDate: "",
    endDate: "",
    description: "",
  });
  const { data: filterJournal } = useGetFilterJournalByDate(
    formData.startDate,
    formData.endDate,
    formData.description
  );

  const [journal, setJournal] = useState<
    IPaginationResponse<IJournals> | IJournals[] | undefined
  >(allJournal);

  useEffect(() => {
    if (filterJournal && filterJournal?.length > 0) {
      setJournal(filterJournal);
    } else {
      setJournal(allJournal);
    }
  }, [filterJournal, allJournal]);
  useEffect(() => {
    if (ledgerData?.Items) {
      const ledgerMap = ledgerData.Items.reduce(
        (
          acc: { [x: string]: string },
          ledger: { id: string | number; name: string }
        ) => {
          acc[ledger.id] = ledger.name;
          return acc;
        },
        {} as { [key: string]: string }
      );

      setLedgers(ledgerMap);
    }
  }, [ledgerData]);

  const getJournalsArray = (): IJournals[] => {
    if (journal && "Items" in journal) {
      return journal.Items;
    } else if (Array.isArray(journal)) {
      return journal;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      journals: getJournalsArray(),
      errorMessage: error ? "Failed to fetch journals" : "",
    });
  }, [journal, error]);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  useEffect(() => {
    refetchLedgers();
  }, []);
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteJournal(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [showJournal, setShowJournal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowJournal(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const handleExportExcel = () => {
    const originalPaginationParams = { ...paginationParams };

    setPaginationParams({
      pageSize: 10000,
      pageIndex: 1,
      isPagination: false,
    });

    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(
        state.journals.flatMap((journal) =>
          journal.journalEntries.map((entry) => ({
            Date: journal.transactionDate,
            Reference: journal.referenceNumber,
            Ledger: ledgers[entry.ledgerId] || "Unknown Ledger",
            Debit: entry.debitAmount,
            Credit: entry.creditAmount,
            Description: journal.description || "",
          }))
        )
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, ws, "journal");

      XLSX.writeFile(workbook, "journal.xlsx");

      setPaginationParams(originalPaginationParams);
    }, 100);
  };

  const handlePrint = () => {
    const originalPaginationParams = { ...paginationParams };

    setPaginationParams({
      pageSize: 10000,
      pageIndex: 1,
      isPagination: false,
    });

    setTimeout(() => {
      setIsPrinting(true);

      if (tableRef.current) {
        html2pdf()
          .from(tableRef.current)
          .save("journal.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
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

      const parsedData: IJournals[] = XLSX.utils.sheet_to_json(sheet);

      setState((prev) => ({
        ...prev,
        ledgers: [...prev.journals, ...parsedData],
      }));

      alert("CSV file imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };
  if (!journal) {
    return (
      <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {(allJournal?.Items || []).length > 0 && (
        <FilterJournalForm form={form} setFormData={setFormData} />
      )}
      <div ref={tableRef}>
        {state.journals.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Date")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("R.f")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Particular")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Debit Amount")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Credit Amount")}
                </th>
                {!isPrinting && (
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                    {t("Actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {state.journals.map((item: IJournals) => (
                <React.Fragment key={item.id}>
                  {item.journalEntries?.length > 0 ? (
                    item.journalEntries.map((detail, detailIndex) => (
                      <tr
                        key={`${item.id}-detail-${detailIndex}`}
                        className="text-center even:bg-gray-100 text-sm"
                      >
                        {detailIndex === 0 ? (
                          <>
                            <td className="border px-4 py-2">
                              {item.transactionDate}
                            </td>
                            <td className="border px-4 py-2">
                              {item.referenceNumber}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                          </>
                        )}

                        <td className="border px-4 py-2">
                          <div>
                            {detail.creditAmount
                              ? `To   ${
                                  ledgers[detail.ledgerId] || "Unknown Ledger"
                                }`
                              : ledgers[detail.ledgerId] || "Unknown Ledger"}
                            &ensp;A/C
                          </div>

                          {(item.journalEntries.length === 1 ||
                            detailIndex === item.journalEntries.length - 1) &&
                            item.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                ({item.description})
                              </div>
                            )}
                        </td>
                        <td className="border px-4 py-2">
                          {detail.debitAmount}
                        </td>
                        <td className="border px-4 py-2">
                          {detail.creditAmount}
                        </td>
                        {!isPrinting && detailIndex === 0 && (
                          <td
                            className="border px-4 py-2"
                            rowSpan={item.journalEntries.length}
                          >
                            <div className="flex space-x-2">
                              {canDelete && (
                                <DeleteButton
                                  handleDelete={() => handleDelete(item.id)}
                                  isLoading={isLoading}
                                />
                              )}
                              {canEdit && (
                                <div>
                                  <EditButton
                                    button={buttonElement(item.id ?? "")}
                                  />
                                </div>
                              )}
                              {selectedId && selectedId !== "" && (
                                <EditJournal
                                  visible={showJournal}
                                  onClose={() => setShowJournal(false)}
                                  journalId={selectedId}
                                  currentPageIndex={paginationParams.pageIndex}
                                />
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr
                      key={item.id}
                      className="text-center even:bg-gray-100 text-sm"
                    >
                      <td className="border px-4 py-2">
                        {item.transactionDate}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex space-x-2">
                          {canDelete && (
                            <DeleteButton
                              handleDelete={() => handleDelete(item.id)}
                              isLoading={isLoading}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gray-200 font-semibold text-sm">
                <td className="border px-4 py-2 text-right" colSpan={1}>
                  {t("Total Balance")}:
                </td>

                <td className="border px-4 py-2 text-right" colSpan={4}>
                  {state.journals
                    .flatMap((journal) => journal.journalEntries ?? [])
                    .reduce(
                      (sum, detail) => sum + (detail?.debitAmount ?? 0),
                      0
                    )}
                </td>

                <td></td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No journals found.
          </p>
        )}
      </div>
      {state.journals.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(journal) ? 1 : journal?.PageIndex ?? 1,
            firstPage: Array.isArray(journal) ? 1 : journal?.FirstPage ?? 1,
            lastPage: Array.isArray(journal) ? 1 : journal?.LastPage ?? 1,
            nextPage: Array.isArray(journal) ? 1 : journal?.NextPage ?? 1,
            previousPage: Array.isArray(journal)
              ? 1
              : journal?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
      <div className="flex justify-end space-x-2 ">
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

export default AllJournalForm;
