import { useEffect, useRef, useState } from "react";
import {
  useGetAllSales,
  useRemoveSales,
  useGetFilterSalesByDate,
} from "../hooks/index";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { ISales } from "../types/ISales";
import { useForm } from "react-hook-form";
import Pagination from "@/hooks/pagination";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import React from "react";
import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit, Printer, RotateCcw } from "lucide-react";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import EditSales from "../pages/Edit";
import { IFilterSalesByDate } from "../types/ISales";
import FilterSalesForm from "./FilterSalesForm";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { useGetAllItem } from "@/modules/end-user/Inventory/Item/hooks";
import { IItem } from "@/modules/end-user/Inventory/Item/types/IItem";
import AddSalesReturn from "../../salesReturn/pages/Add";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
// interface AllSalesFormProps {
//   ledgerId?: string; // Prop to specify the account to filter sales
// }

const AllSalesForm = () => {
  const { t } = useTranslation();
  const form = useForm<IFilterSalesByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      ledgerId: "",
    },
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 50,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: true,
    Sales: [] as ISales[],
    errorMessage: "",
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
    updateState({ loading: true, Sales: [] });
  };
  const [showSalesReturn, setShowSalesReturn] = useState(false);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const { mutateAsync: deleteSales } = useRemoveSales();
  const [isLoading, setIsLoading] = useState(false);
  const { data: allSales, error, refetch, isFetching } = useGetAllSales(query);
  const { data: allItems, isLoading: itemsLoading } = useGetAllItem();
  const { data: ledgerData } = useGetAllLedgers();
  const { menuStatus } = usePermissions();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const [ledgers, setLedgers] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<IFilterSalesByDate>({
    startDate: "",
    endDate: "",
    ledgerId: "",
  });
  const [selectedRef, setSelectedRef] = useState("");
  const { data: filterSales } = useGetFilterSalesByDate(
    formData.startDate,
    formData.endDate,
    formData.ledgerId
  );
  const [Sales, setSales] = useState<
    IPaginationResponse<ISales> | ISales[] | undefined
  >(allSales);

  useEffect(() => {
    if (filterSales && filterSales?.length > 0) {
      setSales(filterSales);
    } else {
      setSales(allSales);
    }
  }, [filterSales, allSales]);

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

  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteSales(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSalesArray = (): ISales[] => {
    if (Sales && "Items" in Sales) {
      return Sales.Items;
    } else if (Array.isArray(Sales)) {
      return Sales;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      Sales: getSalesArray(),
      errorMessage: error ? "Failed to fetch Sales" : "",
    });
  }, [Sales, error]);

  const [showSales, setShowSales] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          console.log(id);
          setShowSales(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

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
          .save("AllSales.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  const salesReturnButton = (id: string, salesStatus: number | undefined) => {
    return (
      <ButtonElement
        disabled={salesStatus === 3}
        icon={<RotateCcw size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowSalesReturn(true);
          setSelectedRef(id);
        }}
        className="!text-xs font-bold !bg-yellow-400"
      />
    );
  };
  const [itemsMap, setItemsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!itemsLoading && allItems?.Items && Array.isArray(allItems.Items)) {
      const map = allItems.Items.reduce(
        (acc: Record<string, string>, item: IItem) => {
          if (item?.id && item?.name) {
            acc[item.id] = item.name;
          }
          if (item?.hsCode) {
            acc[item.hsCode] = item.hsCode;
          }
          return acc;
        },
        {}
      );
      setItemsMap(map);
    }
  }, [allItems, itemsLoading]);

  const handlePrintInvoice = (sales: ISales) => {
    if (itemsLoading || !allItems?.Items || !ledgerData?.Items) {
      alert("Please wait, data is still loading...");
      return;
    }

    const itemsHtml =
      sales.salesItems &&
      Array.isArray(sales.salesItems) &&
      sales.salesItems.length > 0
        ? sales.salesItems
            .map(
              (item, index) => `

                <tr>
                  <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${
                    index + 1
                  }</td>
                 <td style="border: 1px solid #ccc; padding: 12px;">${
                   itemsMap[item.hscode ? item.hscode : "Unknown Item"]
                 }</td>
                  <td style="border: 1px solid #ccc; padding: 12px;">${
                    itemsMap[item.itemId] || "Unknown Item"
                  }</td>
                  <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${
                    item.quantity || 1
                  }</td>
                  <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${
                    item.price || 0
                  }</td>
                  <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${
                    item.amount || 0
                  }</td>
            
              `
            )
            .join("")
        : `
            <tr>
              <td colspan="6" style="border: 1px solid #ccc; padding: 12px; text-align: center;">No items available</td>
            </tr>
          `;

    const itemCount =
      sales.salesItems && Array.isArray(sales.salesItems)
        ? sales.salesItems.length
        : 0;
    const emptyRowCount = Math.max(0, 10 - itemCount);
    const emptyRows = Array(emptyRowCount)
      .fill("")
      .map(
        () => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;"></td>
          </tr>
        `
      )
      .join("");

    const finalItemsHtml = itemsHtml + emptyRows;

    const invoiceContent = `
      <div style="max-width: 800px; margin: auto; padding: 40px; font-family: 'Times New Roman', serif; font-size: 14px; color: #000; border: 1px solid #ccc;">

  <table style="width: 100%; margin-bottom: 20px;">
    <tr>
      <td style="text-align: left; vertical-align: top; width: 66%;">
        <p><strong>Bill No:</strong> ${sales.billNumber || "N/A"}</p>
        <p><strong>Customer:</strong> ${
          ledgers[sales.ledgerId] || "Unknown Customer"
        }</p>
        <p><strong>Ref No:</strong> ${sales.referenceNumber || "N/A"}</p>
      </td>
      
      <td style="text-align: right; vertical-align: top; width: 34%;">
        <p><strong>Date:</strong> ${sales.date || "N/A"}</p>
        <p><strong>Payment ID:</strong> ${sales.paymentId ?? "[Not Set]"}</p>

      </td>
    </tr>
  </table>

  <table style="width: 100%; border-collapse: collapse;" border="1">
    <thead style="background-color: #f0f0f0;">
      <tr>
        <th style="padding: 8px; text-align: center;">S.N.</th>
        <th style="padding: 8px; text-align: center;">HS Code</th>
        <th style="padding: 8px; text-align: left;">Item Description</th>
        <th style="padding: 8px; text-align: center;">Qty</th>
        <th style="padding: 8px; text-align: right;">Rate (Rs.)</th>
        <th style="padding: 8px; text-align: right;">Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${finalItemsHtml}
      <tr>
        <td colspan="5" style="padding: 8px; text-align: right;"><strong>Subtotal</strong></td>
        <td style="padding: 8px; text-align: right;">Rs. ${
          sales.grandTotalAmount || 0
        }</td>
      </tr>

      ${
        Number(sales.discountAmount || 0) > 0
          ? `
        <tr>
          <td colspan="5" style="padding: 8px; text-align: right;"><strong>Discount (${
            sales.discountPercent || 0
          }%)</strong></td>
          <td style="padding: 8px; text-align: right;">-Rs. ${
            sales.discountAmount || 0
          }</td>
        </tr>`
          : ""
      }

      ${
        Number(sales.vatAmount || 0) > 0
          ? `
        <tr>
          <td colspan="5" style="padding: 8px; text-align: right;"><strong>VAT (${
            sales.vatPercent || 0
          }%)</strong></td>
          <td style="padding: 8px; text-align: right;">Rs. ${
            sales.vatAmount || 0
          }</td>
        </tr>`
          : ""
      }

      <tr>
        <td colspan="5" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total</td>
        <td style="padding: 8px; text-align: right; font-weight: bold;">Rs. ${
          sales.grandTotalAmount || 0
        }</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 20px;">
    <strong>Amount in Words:</strong> ${sales.amountInWords || "N/A"}
  </div>

  <!-- Signature -->
  <div style="margin-top: 50px; text-align: right;">
    <p>------------------------</p>
    <p><strong>Authorized Signature</strong></p>
  </div>
</div>

    `;
    console.log("Invoice data:", {
      billnumber: sales.billNumber,
      referenceNumber: sales.referenceNumber,
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${sales.billNumber || "N/A"}</title>
            <style>
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table, th, td {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${invoiceContent}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportExcel = async () => {
    if (state.Sales.length === 0) {
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
      const allsales = state.Sales;

      if (allsales.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(allsales);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "sales");

        XLSX.writeFile(workbook, "Allsales.xlsx");

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
      {state.loading ||
        (isFetching && (
          <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ))}
      {(allSales?.Items || []).length > 0 && (
        <FilterSalesForm form={form} setFormData={setFormData} />
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      <div className="overflow-x-auto">
        <div ref={tableRef}>
          {state.Sales.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Date")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Bill No")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Party Name")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Quantity")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Amount")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Discount")} %
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Discount Amount")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Vat")} %
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Vat Amount")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Status")}
                  </th>
                  {!isPrinting && (
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {state?.Sales.map((Sales: ISales, index: number) => (
                  <React.Fragment key={index}>
                    <tr key={index}>
                      <td className="p-2 border">{Sales.date}</td>
                      <td className="p-2 border">{Sales.billNumber}</td>
                      <td className="p-2 border">
                        {ledgers[Sales.ledgerId] || "Unknown Ledger"}
                      </td>
                      <td className="p-2 border">{Sales.totalQuantity}</td>
                      <td className="p-2 border">{Sales.grandTotalAmount}</td>
                      <td className="p-2 border">{Sales.discountPercent}</td>
                      <td className="p-2 border">{Sales.discountAmount}</td>
                      <td className="p-2 border">{Sales.vatPercent}</td>
                      <td className="p-2 border">{Sales.vatAmount}</td>
                      <td className="p-2 border">
                        {Sales.salesStatus === 1 ? (
                          <div className="bg-[#C7ECDF] rounded-3xl py-1 flex justify-center text-teal-800">
                            {t("Settled")}
                          </div>
                        ) : Sales.salesStatus === 2 ? (
                          <div className="bg-[#C4E0FD] rounded-3xl py-1  flex justify-center text-blue-800">
                            {t("Partially Returned")}
                          </div>
                        ) : Sales.salesStatus === 3 ? (
                          <div className="bg-[#FFF2B4] rounded-3xl py-1  flex justify-center text-yellow-500">
                            {t("Returned")}
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                      {!isPrinting && (
                        <td className="p-2 border flex space-x-2">
                          <button
                            onClick={() => handlePrintInvoice(Sales)}
                            className="bg-blue-500 text-white p-1 rounded flex items-center justify-center"
                            title="Print Invoice"
                          >
                            <Printer size={14} />
                          </button>
                          {canDelete && (
                            <div>
                              <DeleteButton
                                handleDelete={() => handleDelete(Sales.id)}
                                isLoading={isLoading}
                              />
                            </div>
                          )}
                          {canEdit && (
                            <div>
                              <EditButton
                                button={buttonElement(Sales.id ?? "")}
                              />
                            </div>
                          )}
                          <EditButton
                            button={salesReturnButton(
                              Sales.referenceNumber ?? "",
                              Sales.salesStatus
                            )}
                          />
                          {selectedRef && selectedRef !== "" && (
                            <AddSalesReturn
                              visible={showSalesReturn}
                              onClose={() => setShowSalesReturn(false)}
                              selectedSalesDetailsId={selectedRef}
                            />
                          )}
                          {selectedId && selectedId !== "" && (
                            <EditSales
                              visible={showSales}
                              onClose={() => setShowSales(false)}
                              SalesId={selectedId}
                              currentPageIndex={paginationParams.pageIndex}
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {t("No Sales Found")}.
            </p>
          )}
        </div>
      </div>
      {state.Sales.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Sales) ? 1 : Sales?.PageIndex ?? 1,
              firstPage: Array.isArray(Sales) ? 1 : Sales?.FirstPage ?? 1,
              lastPage: Array.isArray(Sales) ? 1 : Sales?.LastPage ?? 1,
              nextPage: Array.isArray(Sales) ? 1 : Sales?.NextPage ?? 1,
              previousPage: Array.isArray(Sales) ? 1 : Sales?.PreviousPage ?? 1,
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
          className="border rounded-md h-8 text-white bg-teal-500"
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

export default AllSalesForm;
