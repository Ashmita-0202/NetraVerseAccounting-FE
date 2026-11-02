import { useEffect, useRef, useState } from "react";
import { useGetAllIncome, useRemoveTransaction } from "../hooks/index";
import { IIncome } from "../../Income/types/IIncome";
import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit, Printer } from "lucide-react";
import EditIncomes from "../pages/Edit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import React from "react";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllIncomesForm = () => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 50,
    pageIndex: 1,
    isPagination: true,
  });

  const [state, setState] = useState({
    loading: true,
    incomes: [] as IIncome[],
    errorMessage: "",
  });

  const { mutateAsync: deleteIncomes } = useRemoveTransaction();
  const {
    data: allTransactions,
    error,
    refetch,
    isFetching,
  } = useGetAllIncome(
    `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showIncomes, setShowIncomes] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (allTransactions?.Items) {
      const filtered = allTransactions.Items.filter(
        (item: IIncome) => item.transactionMode === 1
      );
      setState({
        loading: false,
        incomes: filtered,
        errorMessage: error ? "Failed to fetch incomes" : "",
      });
    } else if (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        errorMessage: "Failed to fetch incomes",
      }));
    }
  }, [allTransactions, error]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error("No income ID provided for deletion");
      return;
    }
    setIsLoading(true);
    try {
      await deleteIncomes(id);
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
      setState((prev) => ({
        ...prev,
        errorMessage: "Failed to delete income",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintSingleIncome = (income: IIncome) => {
    if (
      !income.id ||
      !income.transactionDate ||
      income.totalAmount == null ||
      !income.narration
    ) {
      console.error("Invalid income data for printing", income);
      alert("Cannot print income: Missing or invalid data");
      return;
    }

    setIsPrinting(true);

    // Truncate narration to prevent overflow (reduced to 100 characters)
    const maxNarrationLength = 100;
    const narration =
      income.narration.length > maxNarrationLength
        ? income.narration.substring(0, maxNarrationLength) + "..."
        : income.narration;

    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.display = "none";
    printContainer.innerHTML = `
   <style>
  @media print {
    body * {
      visibility: hidden;
    }

    #print-container, #print-container * {
      visibility: visible;
    }

    #print-container {
      display: block !important;
      position: absolute;
      top: 0;
      left: 0;
      width: 190mm; /* within A4 width */
      height: auto;
      margin: 0 auto;
      padding: 5mm;
      box-sizing: border-box;
      page-break-inside: avoid !important;
      page-break-before: avoid !important;
      page-break-after: avoid !important;
    }

    @page {
      size: A4;
      margin: 10mm;
    }

    table {
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 4px;
      border: 1px solid #ccc;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
  }

  /* Optional: Also restrict height and hide overflow for narration */
  td.narration {
    max-height: 40px;
    overflow: hidden;
  }
</style>

    <div style="
      font-family: Arial, sans-serif;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      background-color: #fff;
      box-sizing: border-box;
      font-size: 11px; /* Reduced font size */
    ">
      <h2 style="text-align: center; margin: 0 0 8px; font-size: 14px;">Income Receipt</h2>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 3px; font-weight: 600; width: 25%;">Date</th>
            <th style="border: 1px solid #ccc; padding: 3px; font-weight: 600; width: 25%;">Total Amount</th>
            <th style="border: 1px solid #ccc; padding: 3px; font-weight: 600; width: 50%;">Narration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ccc; padding: 3px;">${new Date(
              income.transactionDate
            ).toLocaleDateString()}</td>
            <td style="border: 1px solid #ccc; padding: 3px; text-align: right;">${income.totalAmount.toFixed(
              2
            )}</td>
            <td style="border: 1px solid #ccc; padding: 3px;">${narration}</td>
          </tr>
        </tbody>
      </table>
      <footer style="margin-top: 8px; text-align: center; font-size: 9px; color: #666;">
        Generated on ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kathmandu",
        })}
      </footer>
    </div>
  `;

    document.body.appendChild(printContainer);
    setTimeout(() => {
      window.print();
      document.body.removeChild(printContainer);
      setIsPrinting(false);
    }, 0);
  };
  const handlePrint = () => {
    const originalPagination = { ...paginationParams };
    setPaginationParams({ pageSize: 10000, pageIndex: 1, isPagination: false });
    setIsPrinting(true);

    setTimeout(() => {
      if (tableRef.current) {
        html2pdf()
          .from(tableRef.current)
          .save("IncomesDetails.pdf")
          .finally(() => {
            setPaginationParams(originalPagination);
            setIsPrinting(false);
          });
      }
    }, 0);
  };

  const handleExportExcel = async () => {
    if (state.incomes.length === 0) {
      alert("No incomes to export.");
      return;
    }

    const originalPagination = { ...paginationParams };
    setPaginationParams({ pageSize: 10000, pageIndex: 1, isPagination: false });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const worksheet = XLSX.utils.json_to_sheet(state.incomes);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
      XLSX.writeFile(workbook, "Incomes.xlsx");
      setPaginationParams(originalPagination);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data.");
    }
  };

  const buttonElement = (id: string) => (
    <ButtonElement
      icon={<Edit size={14} />}
      type="button"
      text=""
      onClick={() => {
        setShowIncomes(true);
        setSelectedId(id);
      }}
      className="!text-xs font-bold !bg-teal-500"
    />
  );

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  return (
    <div className="p-4">
      {state.errorMessage && (
        <p className="text-red-500 text-center">{state.errorMessage}</p>
      )}
      {state.loading ||
        (isFetching && (
          <div className="relative" style={{ minHeight: "50rem" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipLoader color="#36d7b7" size={50} />
            </div>
          </div>
        ))}
      <div ref={tableRef}>
        <div className="overflow-x-auto">
          {state.incomes.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 sm:px-4 py-2">{t("Date")}</th>
                  <th className="border px-2 sm:px-4 py-2">
                    {t("Total Amount")}
                  </th>
                  <th className="border px-2 sm:px-4 py-2">{t("Narration")}</th>
                  {!isPrinting && (
                    <th className="border px-2 sm:px-4 py-2 hide-on-print">
                      {t("Actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {state.incomes.map((income, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="border px-2 py-1">
                        {new Date(income.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="border px-2 py-1">
                        {income.totalAmount.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1">{income.narration}</td>
                      {!isPrinting && (
                        <td className="border px-2 py-1 flex space-x-2">
                          <button
                            className="bg-blue-500 text-white p-1 rounded"
                            title="Print Income"
                            onClick={() => handlePrintSingleIncome(income)}
                          >
                            <Printer size={14} />
                          </button>
                          <DeleteButton
                            handleDelete={() => handleDelete(income.id)}
                            isLoading={isLoading}
                          />
                          <EditButton button={buttonElement(income.id ?? "")} />
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">{t("No Income Found")}.</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <select
          onChange={(e) => {
            if (e.target.value === "pdf") handlePrint();
            else if (e.target.value === "excel") handleExportExcel();
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
      {showIncomes && selectedId && (
        <EditIncomes
          visible={showIncomes}
          onClose={() => setShowIncomes(false)}
          incomeId={selectedId}
        />
      )}
    </div>
  );
};

export default AllIncomesForm;
