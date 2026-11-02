import { useEffect, useRef, useState } from "react";
import { useGetAllExpenses } from "../hooks";
import { IExpenses } from "../types/IExpenses";
import React from "react";
// import { EditButton } from "@/components/common/EditButton";
// import { ButtonElement } from "@/components/FormComponents/Button";
import { Printer } from "lucide-react";
// import EditExpenses from "../pages/Edit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllExpensesForm = () => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 50,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: true,
    Expenses: [] as IExpenses[],
    errorMessage: "",
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const {
    data: allTransactions,
    error,
    refetch,
    isFetching,
  } = useGetAllExpenses(query);
  const allExpenses: IExpenses[] =
    allTransactions?.Items.filter(
      (item: IExpenses) => item.transactionMode === 2
    ) || [];
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const getExpensesArray = (): IExpenses[] => allExpenses;

  // Print all expenses
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
          .save("expensesDetails.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 0);
  };

  // Print individual expense
  const handlePrintSingleExpense = (expense: IExpenses) => {
    if (
      !expense.id ||
      !expense.transactionDate ||
      expense.totalAmount == null ||
      !expense.narration
    ) {
      console.error("Invalid expense data for printing", expense);
      alert("Cannot print expense: Missing or invalid data");
      return;
    }

    setIsPrinting(true);

    // Truncate narration to prevent overflow (e.g., 200 characters)
    const maxNarrationLength = 200;
    const narration =
      expense.narration.length > maxNarrationLength
        ? expense.narration.substring(0, maxNarrationLength) + "..."
        : expense.narration;

    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.display = "none"; // Hide in normal view
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
      border-radius: 6px;
      padding: 10px;
      background-color: #fff;
      box-sizing: border-box;
      font-size: 12px;
    ">
      <h2 style="text-align: center; margin: 0 0 10px; font-size: 16px;">Expense Receipt</h2>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 4px; font-weight: 600; width: 25%;">Date</th>
            <th style="border: 1px solid #ccc; padding: 4px; font-weight: 600; width: 25%;">Total Amount</th>
            <th style="border: 1px solid #ccc; padding: 4px; font-weight: 600; width: 50%;">Narration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${new Date(
              expense.transactionDate
            ).toLocaleDateString()}</td>
            <td style="border: 1px solid #ccc; padding: 4px; text-align: right;">${expense.totalAmount.toFixed(
              2
            )}</td>
            <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${narration}</td>
          </tr>
        </tbody>
      </table>
      <footer style="margin-top: 10px; text-align: center; font-size: 10px; color: #666;">
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

  const handleExportExcel = async () => {
    if (state.Expenses.length === 0) {
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
      const allLedgers = state.Expenses;

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
      Expenses: getExpensesArray(),
      errorMessage: error ? "Failed to fetch Expenses" : "",
    });
  }, [allTransactions, error]);

  // const [showExpenses, setShowExpenses] = useState(false);
  // const [selectedId, setSelectedId] = useState<string>("");

  // const buttonElement = (id: string) => {
  //   return (
  //     <ButtonElement
  //       icon={<Edit size={14} />}
  //       type="button"
  //       text=""
  //       onClick={() => {
  //         setShowExpenses(true);
  //         setSelectedId(id);
  //       }}
  //       className="!text-xs font-bold !bg-teal-500"
  //     />
  //   );
  // };

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  return (
    <div className="p-4">
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
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
          {state.Expenses.length > 0 ? (
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
                {state?.Expenses.map((expense: IExpenses, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="p-2 border">{expense.transactionDate}</td>
                      <td className="p-2 border">{expense.totalAmount}</td>
                      <td className="p-2 border">{expense.narration}</td>
                      {!isPrinting && (
                        <td className="p-2 border flex space-x-2">
                          <button
                            className="bg-blue-500 text-white p-1 rounded"
                            title="Print Expense"
                            onClick={() => handlePrintSingleExpense(expense)}
                          >
                            <Printer size={14} />
                          </button>

                          {/* <div>
                            <EditButton
                              button={buttonElement(expense.id ?? "")}
                            />
                          </div> */}
                          {/* {selectedId && selectedId !== "" && (
                            // <EditExpenses
                            //   visible={showExpenses}
                            //   onClose={() => setShowExpenses(false)}
                            //   expenseId={selectedId}
                            // />
                          )} */}
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {t("No Expense Found")}.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
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
  );
};

export default AllExpensesForm;
