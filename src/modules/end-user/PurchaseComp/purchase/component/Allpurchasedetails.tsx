import { useEffect, useRef, useState } from "react";
import {
  useGetAllPurchase,
  useRemovePurchase,
  useGetFilterPurchaseByDate,
} from "../hooks/index";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { IPurchase } from "../types/Ipurchase";
import { useForm } from "react-hook-form";
import Pagination from "@/hooks/pagination";
import React from "react";
import { DeleteButton } from "@/components/common/DeleteButton";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit, Printer, RotateCcw } from "lucide-react";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import EditPurchase from "../pages/Edit";
import { IFilterPurchaseByDate } from "../types/Ipurchase";
import FilterPurchaseForm from "./FilterPurchaseForm";
import { IPaginationResponse } from "@/types/IPaginationResponse";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { useGetAllItem } from "@/modules/end-user/Inventory/Item/hooks";
import { IItem } from "@/modules/end-user/Inventory/Item/types/IItem";
import AddPurchaseReturn from "../../purchaseReturn/pages/Add";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllPurchaseForm = () => {
  const form = useForm<IFilterPurchaseByDate>({
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
    Purchase: [] as IPurchase[],
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
    updateState({ loading: true, Purchase: [] });
  };

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const { t } = useTranslation();
  const { mutateAsync: deletePurchase } = useRemovePurchase();
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: allPurchase,
    error,
    refetch,
    isFetching,
  } = useGetAllPurchase(query);
  const { data: allLedgers } = useGetAllLedgers();
  const { menuStatus } = usePermissions();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const {
    data: allItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useGetAllItem();
  const [isPrinting, setIsPrinting] = useState(false);
  const [formData, setFormData] = useState<IFilterPurchaseByDate>({
    startDate: "",
    endDate: "",
    ledgerId: "",
  });
  const { data: filterPurchase } = useGetFilterPurchaseByDate(
    formData.startDate,
    formData.endDate,
    formData.ledgerId
  );
  const [Purchase, setPurchase] = useState<
    IPaginationResponse<IPurchase> | IPurchase[] | undefined
  >(allPurchase);
  useEffect(() => {
    if (filterPurchase && filterPurchase?.length > 0) {
      setPurchase(filterPurchase);
    } else {
      setPurchase(allPurchase);
    }
  }, [filterPurchase, allPurchase]);

  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deletePurchase(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPurchaseArray = (): IPurchase[] => {
    if (Purchase && "Items" in Purchase) {
      return Purchase.Items;
    } else if (Array.isArray(Purchase)) {
      return Purchase;
    }
    return [];
  };

  const [itemsMap, setItemsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (itemsError) {
      console.error("Failed to load items:", itemsError);
      return;
    }

    if (!itemsLoading && allItems?.Items && Array.isArray(allItems.Items)) {
      try {
        const map = allItems.Items.reduce(
          (acc: Record<string, string>, item: IItem) => {
            if (item?.id && item?.name) {
              acc[item.id] = item.name;
            } else {
              console.warn("Invalid item format:", item);
            }
            return acc;
          },
          {}
        );

        setItemsMap(map);
        console.log("Created item map with", Object.keys(map).length, "items");
      } catch (error) {
        console.error("Error creating item map:", error);
      }
    } else {
      console.warn("No items to process or items are not an array");
    }
  }, [allItems, itemsLoading, itemsError]);

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
          .save("purchaseDetails.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  const handlePrintInvoice = (purchase: IPurchase) => {
    const itemsHtml =
      purchase.PurchaseItems && purchase.PurchaseItems.length > 0
        ? purchase.PurchaseItems.map(
            (item, index) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${
              index + 1
            }</td>
            <td style="border: 1px solid #ccc; padding: 12px;">${
              itemsMap[item.itemId] || item.itemId
            }</td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${
              item.quantity || 1
            }</td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${
              item.price || 0
            }</td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${
              item.amount
            }</td>
          </tr>
        `
          ).join("")
        : "";

    // Empty rows remain the same
    const emptyRows = Array(11)
      .fill("")
      .map(
        () => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: center;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;"></td>
            <td style="border: 1px solid #ccc; padding: 12px; text-align: right;"></td>
          </tr>
        `
      )
      .join("");

    const finalItemsHtml = itemsHtml + emptyRows;

    const invoiceContent = `
      <div style="width: 800px; margin: auto; padding: 40px; font-family: 'Times New Roman', serif; font-size: 13px; color: #000;">
        <table style="width: 100%; margin-top: 20px; font-size: 13px;">
          <tr>
            <td><strong>Bill No:</strong> ${purchase.billNumber}</td>
            <td><strong>Date:</strong> ${purchase.date}</td>
          </tr>
          <tr>
            <td><strong>Customer:</strong> ${
              Array.isArray(allLedgers?.Items)
                ? allLedgers.Items.find((item) => item.id === purchase.ledgerId)
                    ?.name
                : undefined
            }
          </td>
          </tr> 
        </table>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;" border="1">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th style="padding: 8px;">S.N.</th>
              <th style="padding: 8px;">Item Description</th>
              <th style="padding: 8px;">Qty</th>
              <th style="padding: 8px;">Rate (Rs.)</th>
              <th style="padding: 8px;">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${finalItemsHtml}
            <tr>
              <td colspan="4" style="padding: 8px; text-align: right;"><strong>Subtotal</strong></td>
              <td style="padding: 8px; text-align: right;">Rs. ${
                purchase.grandTotalAmount || 0
              }</td>
            </tr>
            ${
              Number(purchase.discountAmount || 0) > 0
                ? `
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right;"><strong>Discount (${
                  purchase.discountPercent || 0
                }%)</strong></td>
                <td style="padding: 8px; text-align: right;">-Rs. ${
                  purchase.discountAmount
                }</td>
              </tr>
            `
                : ""
            }
            ${
              Number(purchase.vatAmount || 0) > 0
                ? `
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right;"><strong>VAT (${
                  purchase.vatPercent || 0
                }%)</strong></td>
                <td style="padding: 8px; text-align: right;">Rs. ${
                  purchase.vatAmount
                }</td>
              </tr>
            `
                : ""
            }
            <tr>
              <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Rs. ${
                purchase.grandTotalAmount || 0
              }</td>
            </tr>
          </tbody>
        </table>
    
        <div style="margin-top: 20px;">
          <strong>Amount in Words:</strong> ${purchase.amountInWords || ""}
        </div>
    
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <p>------------------------</p>
            <p><strong>Authorized Signature</strong></p>
          </div>
        </div>
      </div>
    `;
    const printWindow = window.open("about", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${purchase.billNumber}</title>
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
              }, 200);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  const handleExportExcel = async () => {
    if (state.Purchase.length === 0) {
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
      const allLedgers = state.Purchase;

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
      Purchase: getPurchaseArray(),
      errorMessage: error ? "Failed to fetch Purchase" : "",
    });
  }, [Purchase, error]);

  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedRefId, setSelectedRefId] = useState("");
  const [showPurchaseReturn, setShowPurchaseReturn] = useState(false);
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowPurchase(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const purchaseReturnButton = (id: string, status: number | undefined) => {
    return (
      <ButtonElement
        disabled={status === 3}
        icon={<RotateCcw size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowPurchaseReturn(true);
          setSelectedRefId(id);
          console.log(id);
        }}
        className="!text-xs font-bold !bg-yellow-400"
      />
    );
  };
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  return (
    <div className="p-4">
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {(allPurchase?.Items || []).length > 0 && (
        <FilterPurchaseForm form={form} setFormData={setFormData} />
      )}
      {state.loading ||
        (isFetching && (
          <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ))}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      <div ref={tableRef}>
        <div className="overflow-x-auto">
          {state.Purchase.length > 0 ? (
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
                    {t("Amount")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Quantity")}
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
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                      {t("Actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {state?.Purchase.map((Purchase: IPurchase) => (
                  <React.Fragment key={Purchase.id}>
                    <tr key={Purchase.id}>
                      <td className="p-2 border">{Purchase.date}</td>
                      <td className="p-2 border">{Purchase.billNumber}</td>
                      <td className="p-2 border">
                        {Array.isArray(allLedgers?.Items)
                          ? allLedgers.Items.find(
                              (item) => item.id === Purchase.ledgerId
                            )?.name
                          : undefined}
                      </td>
                      <td className="p-2 border">
                        {Purchase.grandTotalAmount}
                      </td>
                      <td className="p-2 border">{Purchase.totalQuantity}</td>
                      <td className="p-2 border">{Purchase.discountPercent}</td>
                      <td className="p-2 border">{Purchase.discountAmount}</td>
                      <td className="p-2 border">{Purchase.vatPercent}</td>
                      <td className="p-2 border">{Purchase.vatAmount}</td>
                      <td className="p-2 border">
                        {Purchase.status === 1 ? (
                          <div className="bg-[#C7ECDF] rounded-3xl py-1 flex justify-center text-teal-800">
                            {t("Settled")}
                          </div>
                        ) : Purchase.status === 2 ? (
                          <div className="bg-[#C4E0FD] rounded-3xl py-1  flex justify-center text-blue-800">
                            {t("Partially Returned")}
                          </div>
                        ) : Purchase.status === 3 ? (
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
                            onClick={() => handlePrintInvoice(Purchase)}
                            className="bg-blue-500 text-white p-1 rounded flex items-center justify-center"
                            title="Print Invoice"
                          >
                            <Printer size={14} />
                          </button>
                          {canDelete && (
                            <div>
                              <DeleteButton
                                handleDelete={() => handleDelete(Purchase.id)}
                                isLoading={isLoading}
                              />
                            </div>
                          )}
                          {canEdit && (
                            <div>
                              <EditButton
                                button={buttonElement(Purchase.id ?? "")}
                              />
                            </div>
                          )}
                          <EditButton
                            button={purchaseReturnButton(
                              Purchase.referenceNumber,
                              Purchase.status
                            )}
                          />
                          {selectedRefId && selectedRefId !== "" && (
                            <AddPurchaseReturn
                              visible={showPurchaseReturn}
                              onClose={() => setShowPurchaseReturn(false)}
                              selectedPurchaseDetailsId={selectedRefId}
                            />
                          )}
                          {selectedId && selectedId !== "" && (
                            <EditPurchase
                              visible={showPurchase}
                              onClose={() => setShowPurchase(false)}
                              purchaseId={selectedId}
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
              {t("No Purchase Found")}.
            </p>
          )}
        </div>
      </div>
      {state.Purchase.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Purchase)
                ? 1
                : Purchase?.PageIndex ?? 1,
              firstPage: Array.isArray(Purchase) ? 1 : Purchase?.FirstPage ?? 1,
              lastPage: Array.isArray(Purchase) ? 1 : Purchase?.LastPage ?? 1,
              nextPage: Array.isArray(Purchase) ? 1 : Purchase?.NextPage ?? 1,
              previousPage: Array.isArray(Purchase)
                ? 1
                : Purchase?.PreviousPage ?? 1,
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

export default AllPurchaseForm;
