/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useRemoveItem, useFilterItemsByDate } from "../hooks";
import { IItem } from "../types/IItem";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { DeleteButton } from "@/components/common/DeleteButton";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";

import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditItem from "../pages/Edit";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import {
  ItemGroupName,
  UnitName,
} from "@/modules/end-user/Inventory/Item/components/GroupName";
import Pagination from "@/hooks/pagination";
import { IFilterItemByDate } from "../types/IItem";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { useUploadItem } from "../hooks";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { InputElement } from "@/components/FormComponents/input";
type Props = {
  form: UseFormReturn<IFilterItemByDate>;
};
const AllItemForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const [state, setState] = useState({
    Loading: false,
    journalReport: [] as IItem[],
    errorMessage: "",
  });

  const [params, setParams] = useState<string | null>(null);
  const {
    data: filterItems,
    refetch,
    error,
    isFetching,
    isLoading,
  } = useFilterItemsByDate(query + (params || ""));
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });

  const handleClear = () => {
    refetch();
    form.reset();
  };

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ Loading: true, journalReport: [] });
  };
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const handleSubmit = useForm<IFilterItemByDate>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error, refetch]);

  const { mutate: uploadItem } = useUploadItem();
  const { mutate: deleteItem } = useRemoveItem();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string) => {
    {
      deleteItem(id, {
        onSuccess: () => {
          refetch();
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
          .save("Items.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  const handleImportExcel = () => {
    fileInputRef.current?.click(); // Open file picker
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadItem(file);
    e.target.value = ""; // reset input so same file can be picked again
  };
  // const toIItem = (
  //   row: Record<string, any>,
  //   rowIndex: number
  // ): IItem | null => {
  //   const requiredFields = ["id", "name", "itemGroupId", "unitId"];

  //   const missing = requiredFields.filter((field) => !row[field]);
  //   if (missing.length > 0) {
  //     console.warn(`Row ${rowIndex + 2} missing fields: ${missing.join(", ")}`);
  //     return null;
  //   }

  //   const parseNumber = (value: any): number | null =>
  //     value === undefined || value === null || value === ""
  //       ? null
  //       : Number(value);

  //   const parseString = (value: any): string | null =>
  //     value === undefined || value === null || value === ""
  //       ? null
  //       : String(value);

  //   const parseBool = (value: any): boolean =>
  //     value === true || value === "true" || value === 1 || value === "1";

  //   const parseStringArray = (value: any): string[] | null =>
  //     typeof value === "string"
  //       ? value.split(",").map((s) => s.trim())
  //       : Array.isArray(value)
  //       ? value
  //       : null;

  //   return {
  //     id: String(row["id"]),
  //     name: String(row["name"]),
  //     price: parseNumber(row["price"]),
  //     itemGroupId: String(row["itemGroupId"]),
  //     unitId: String(row["unitId"]),
  //     sellingPrice: parseString(row["sellingPrice"]),
  //     costPrice: parseString(row["costPrice"]),
  //     barCodeField: parseString(row["barCodeField"]),
  //     expiredDate: parseString(row["expiredDate"]),
  //     openingStockQuantity: parseNumber(row["openingStockQuantity"]),
  //     serialNumbers: parseStringArray(row["serialNumbers"]),
  //     hsCode: parseString(row["hsCode"]),
  //     entryDate: parseString(row["entryDate"]),
  //     minimumLevel: parseNumber(row["minimumLevel"]),
  //     hasConversionFactor: parseBool(row["hasConversionFactor"]),
  //     conversionFactorId: parseString(row["conversionFactorId"]),
  //   };
  // };

  // const readExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (event) => {
  //     const data = new Uint8Array(event.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: "array" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

  //     const validItems: IItem[] = [];
  //     const errors: string[] = [];

  //     rawRows.forEach((row, index) => {
  //       const item = toIItem(row, index);
  //       if (item) validItems.push(item);
  //       else errors.push(`Row ${index + 2} is invalid.`);
  //     });

  //     if (errors.length > 0) {
  //       alert("Some rows were invalid:\n" + errors.join("\n"));
  //     } else {
  //       try {
  //         await uploadItem.mutateAsync(validItems);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     fileInputRef.current!.value = "";
  //   };

  //   reader.readAsArrayBuffer(file);
  // };
  const handleExportExcel = async () => {
    if (!filterItems?.Items && filterItems?.Items.length === 0) {
      alert("No Items to export.");
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
      if (!filterItems?.Items) return;
      const Item = filterItems?.Items;

      if (Item.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(Item);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Item");

        XLSX.writeFile(workbook, "Items.xlsx");

        setPaginationParams(originalPaginationParams);
      } else {
        alert("No data to export.");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data.");
    }
  };
  const onSubmit: SubmitHandler<IFilterItemByDate> = async (formData) => {
    try {
      const queryParams = [
        formData.name ? `name=${encodeURIComponent(formData.name)}` : null,
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";
      setParams(fullQuery);
      await refetch();
    } catch (error) {
      console.error("Error during form submission:", error);
      updateState({
        errorMessage:
          "There was an error fetching the Journal report. Please try again later.",
      });
    }
  };
  return (
    <div className="p-4">
      {isLoading ||
        (isFetching && (
          <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ))}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      <div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
            <InputElement
              layout="column"
              label="Start Date"
              form={form}
              inputType="date"
              name="startDate"
              placeholder="Enter Start Date"
            />
            <InputElement
              label="End Date"
              form={form}
              inputType="date"
              name="endDate"
              placeholder="Enter End Date"
            />
            <InputElement
              layout="column"
              label="Item Name"
              form={form}
              name="name"
              placeholder="Enter Item Name"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 md:mt-0">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                className="flex w-full sm:w-auto"
                style={{
                  backgroundColor: customTheme.palette.themePrimary,
                  padding: "5px 0",
                  borderRadius: "8px",
                }}
                type="submit"
                text="Submit"
              />
            </ThemeProvider>
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                className="flex w-full sm:w-auto"
                style={{
                  backgroundColor: customTheme.palette.themePrimary,
                  padding: "5px 0",
                  borderRadius: "8px",
                }}
                onClick={handleClear}
                type="button"
                text="Clear"
              />
            </ThemeProvider>
          </div>
        </form>
        <div ref={tableRef}>
          {filterItems?.Items && filterItems?.Items.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-200 text-sm sm:text-base">
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("SN")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Item Name")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Price")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Item Group")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Units")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Opening Stock Quantity")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Selling Price")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Cost Price")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Bar Code")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Expired Date")}
                  </th>

                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("HS Code")}
                  </th>
                  {!isPrinting && (
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                      {t("Actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filterItems?.Items.map((Item: IItem, index: number) => (
                  <tr
                    key={index}
                    className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                  >
                    <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.name}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.price}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <ItemGroupName ItemGroupId={Item.itemGroupId} />
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <UnitName UnitId={Item.unitId} />
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.openingStockQuantity}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.sellingPrice}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.costPrice}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.barCodeField}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.expiredDate}
                    </td>

                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {Item.hsCode}
                    </td>
                    {!isPrinting && (
                      <td className="border border-gray-300 px-2 sm:px-4 py-2">
                        <div className="flex space-x-2 items-center justify-center">
                          {canDelete && (
                            <div>
                              <DeleteButton
                                handleDelete={() => handleDelete(Item.id)}
                                isLoading={isLoading}
                              />
                            </div>
                          )}
                          {canEdit && (
                            <div>
                              <EditButton button={buttonElement(Item.id)} />
                            </div>
                          )}

                          {selectedId && selectedId !== "" && (
                            <EditItem
                              visible={showModal}
                              onClose={() => setShowModal(false)}
                              ItemId={selectedId}
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
            <p className="text-center text-sm text-gray-500">No Item found.</p>
          )}
        </div>
      </div>

      {filterItems && filterItems?.Items.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(filterItems)
                ? 1
                : filterItems?.PageIndex ?? 1,
              firstPage: Array.isArray(filterItems)
                ? 1
                : filterItems.FirstPage ?? 1,
              lastPage: Array.isArray(filterItems)
                ? 1
                : filterItems?.LastPage ?? 1,
              nextPage: Array.isArray(filterItems)
                ? 1
                : filterItems?.NextPage ?? 1,
              previousPage: Array.isArray(filterItems)
                ? 1
                : filterItems?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
      <div className="flex justify-end space-x-3 mb-4">
        <select
          onChange={(e) => {
            if (e.target.value === "excel") {
              handleImportExcel();
            }
          }}
          className="border rounded-md text-white bg-teal-500  py-2 "
        >
          <option value="" className="bg-white text-black">
            {t("Import")}
          </option>
          <option value="excel" className="bg-white text-black">
            {t("Import as Excel")}
          </option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 mb-4">
        <select
          onChange={(e) => {
            if (e.target.value === "pdf") {
              handlePrint();
            } else if (e.target.value === "excel") {
              handleExportExcel();
            }
          }}
          className="border rounded-md text-white bg-teal-500  py-2 "
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
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AllItemForm;
