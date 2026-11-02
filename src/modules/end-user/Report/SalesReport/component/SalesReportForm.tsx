import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { useGetSalesReport } from "../hooks";
import { ISalesFilter, ISalesReport } from "../types/ISalesReport";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import {
  useGetAllItem,
  useGetItemById,
} from "@/modules/end-user/Inventory/Item/hooks";
import Pagination from "@/hooks/pagination";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllParties } from "@/modules/end-user/account/parties/hooks";
import { useGetAllSales } from "@/modules/end-user/SalesComp/sales/hooks";
import { useTranslation } from "react-i18next";
import { PeerInput } from "@/components/common/PeerInput";
import ClipLoader from "react-spinners/ClipLoader";
type Props = {
  form: UseFormReturn<ISalesFilter>;
};

const SalesReportForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: false,
    Sales: [] as ISalesReport[],
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
  const handleSubmit = useForm<ISalesFilter>({
    defaultValues: {
      InvoiceNumber: "",
      PartyId: "",
      ItemId: "",
      SerialNumber: [],
    },
  });

  const [itemId, setItemId] = useState("");
  const { data: selectedItem } = useGetItemById(itemId);
  const [partyId, setPartyId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const { data: items } = useGetAllItem();
  const { data: AllSales } = useGetAllSales();
  const { data: party } = useGetAllParties();
  const [dropdownSerial, setDropdownForSerial] = useState(false);
  const inputRefForSerial = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRefForSerial = useRef<HTMLUListElement>(null);
  const [showSerial, setShowSerial] = useState(false);
  const [searchTermForSerial, setSearchTermForSerial] = useState("");
  const [availableSerialNumbers, setAvailableSerialNumbers] = useState<
    string[]
  >([]);
  const [tempSelectedSerials, setTempSelectedSerials] = useState<string[]>([]);
  const handleSearchForSerial = useCallback((value: string) => {
    setSearchTermForSerial(value);
  }, []);
  const handleSelectSerial = (serial: string) => {
    setAvailableSerialNumbers((prev) =>
      prev.includes(serial)
        ? prev.filter((s) => s !== serial)
        : [...prev, serial]
    );
  };
  const handleUnSelectSerial = (
    e: ChangeEvent<HTMLInputElement>,
    serial: string
  ) => {
    const serialNumber = serial;
    if (!e.target.checked) {
      setAvailableSerialNumbers((prev) =>
        prev.filter((s) => s !== serialNumber)
      );
    } else {
      if (!e.target.checked) {
        setAvailableSerialNumbers((prev) =>
          prev.filter((s) => s !== serialNumber)
        );
      }
    }
  };
  const handleCloseSerialModal = () => {
    setShowSerial(false);
    setAvailableSerialNumbers([]);
  };
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [, setIsPrinting] = useState(false);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const filteredSerial = (selectedItem?.serialNumbers as string[])
    ?.filter((group) =>
      group.toLowerCase().includes(searchTermForSerial.toLowerCase())
    )
    ?.filter((group) => !availableSerialNumbers.includes(group));
  useForm();
  const [params, setParams] = useState<string | null>(null);
  useEffect(() => {
    setState({
      loading: false,
      Sales: [],
      errorMessage: "",
    });
  }, []);
  const { data, error, refetch, isLoading, isFetching } = useGetSalesReport(
    query + (params || "")
  );
  const handlePrint = () => {
    const originalPaginationParams = { ...paginationParams };
    setPaginationParams({
      pageSize: 10,
      pageIndex: 1,
      isPagination: false,
    });

    setIsPrinting(true);

    setTimeout(() => {
      if (tableRef.current) {
        html2pdf()
          .from(tableRef.current)
          .save("salesReport.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownForSerial(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const filterBillNo = AllSales?.Items?.filter(
  //   (item) =>
  //     item.billNumber !== undefined &&
  //     item.billNumber !== null &&
  //     item.billNumber !== ""
  // ).map((item) => item.billNumber);

  const uniqueBillNos = [
    ...new Map(
      AllSales?.Items?.map((item) => [item.billNumber, item])
    ).values(),
  ];

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const handleExportExcel = async () => {
    const originalPagination = { ...paginationParams };

    setPaginationParams({
      pageSize: 10000,
      pageIndex: 0,
      isPagination: false,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const alljournalreport = data?.Items || [];

      if (alljournalreport.length === 0) {
        console.error("No data available to export.");
        return;
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(alljournalreport);
      XLSX.utils.book_append_sheet(wb, ws, "sales Report");
      XLSX.writeFile(wb, "salesReport.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setPaginationParams(originalPagination);
    }
  };

  const handleSelectInvoice = (InvoiceNumber: string) => {
    form.setValue("InvoiceNumber", InvoiceNumber);
  };
  const handleSelectParty = (PartyId: string) => {
    form.setValue("PartyId", PartyId);
  };
  const handleSelectItemId = (ItemId: string) => {
    form.setValue("ItemId", ItemId);
  };

  const handleAddSerialNo = (serialNo: string[]) => {
    form.setValue("SerialNumber", serialNo);
    setTempSelectedSerials(serialNo);
    setShowSerial(false);
  };
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error, refetch]);

  const handleClear = () => {
    form.reset();
    setItemId("");
    setInvoiceNo("");
    setPartyId("");
    setTempSelectedSerials([]);
  };

  const onSubmit: SubmitHandler<ISalesFilter> = async (formData) => {
    try {
      const queryParams = [
        formData.InvoiceNumber
          ? `InvoiceNumber=${encodeURIComponent(formData.InvoiceNumber)}`
          : null,
        formData.PartyId
          ? `PartyId=${encodeURIComponent(formData.PartyId)}`
          : null,
        formData.ItemId
          ? `ItemId=${encodeURIComponent(formData.ItemId)}`
          : null,
        formData.SerialNumber?.length
          ? formData.SerialNumber.map(
              (sn) => `SerialNumber=${encodeURIComponent(sn)}`
            ).join("&")
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
          "There was an error fetching the sales report. Please try again later.",
      });
    }
  };

  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  return (
    <div className="p-2">
      {state.loading && (
        <div className="relative" style={{ minHeight: "50rem" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        </div>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-4 p-4 bg-white rounded-md  border-teal-500 border"
        >
          <div className="mb-4">
            <div>
              {items && (
                <AppCombobox
                  value={itemId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Item"
                  options={items.Items}
                  selected={items.Items.find((g) => g.id === itemId) || null}
                  onSelect={(group) => {
                    if (group) {
                      setItemId(group.id || "");
                      handleSelectItemId(group.id || "");
                    } else {
                      setItemId("");
                    }
                  }}
                  getLabel={(g) => g?.name || ""}
                  getValue={(g) => g?.id ?? ""}
                />
              )}
              {selectedItem?.hasSerial && (
                <div className="mt-4 ">
                  <div className="flex w-full">
                    <div className="w-[27%] h-full flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSerial(true);
                          setAvailableSerialNumbers(tempSelectedSerials);
                        }}
                        className={`px-3 py-3 rounded ${"bg-teal-500 hover:bg-teal-600"} text-white`}
                      >
                        {t("Select Serial Number")}
                      </button>
                    </div>

                    <div className="w-[70%] ml-2">
                      <PeerInput
                        disabled
                        label="Serial Selected"
                        placeholder="Serial Selected"
                        name="Serial No"
                        value={tempSelectedSerials ?? ""}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            {party && (
              <AppCombobox
                value={partyId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Party"
                options={party.Items}
                selected={party.Items.find((g) => g.id === partyId) || null}
                onSelect={(group) => {
                  if (group) {
                    setPartyId(group.id || "");
                    handleSelectParty(group.id || "");
                  } else {
                    setPartyId("");
                  }
                }}
                getLabel={(g) => g?.name || ""}
                getValue={(g) => g?.id ?? ""}
              />
            )}
          </div>

          <div className="mb-4">
            {uniqueBillNos && (
              <AppCombobox
                value={invoiceNo}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Invoice No"
                options={uniqueBillNos}
                selected={
                  uniqueBillNos.find((g) => g.billNumber === invoiceNo) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setInvoiceNo(group.billNumber || "");
                    handleSelectInvoice(group.billNumber || "");
                  } else {
                    setInvoiceNo("");
                  }
                }}
                getLabel={(g) => g?.billNumber || ""}
                getValue={(g) => g?.billNumber ?? ""}
              />
            )}
          </div>
          <div className="flex justify-center items-center  h-full mt-1">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                className="flex "
                style={{
                  backgroundColor: customTheme.palette.themePrimary,
                  padding: "5px 0",
                  borderRadius: "8px",
                }}
                type="submit"
                text="Submit"
              />
            </ThemeProvider>
            <ThemeProvider theme={customTheme} className="ml-4">
              <ButtonElement
                className="flex "
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
        <div className=" flex items-center justify-center z-50 w-full">
          <div className="w-full h-[98%] bg-white p-4 shadow-lg overflow-auto relative">
            <div ref={tableRef}>
              <div className="overflow-x-auto">
                {/* {data?.Items && data.Items.length > 0 ? ( */}
                {isLoading || isFetching ? (
                  <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <ClipLoader color="#36d7b7" size={50} />
                  </div>
                ) : (
                  <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">
                          {t("Invoice No")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Party")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Item")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Quantity")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Unit Price")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Returned Quantity")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Tax Rate")}
                        </th>
                        <th className="border border-gray-300 p-2">
                          {t("Discount Rate")}
                        </th>
                      </tr>
                    </thead>
                    {data?.Items && data.Items.length > 0 ? (
                      <tbody>
                        {data?.Items?.map(
                          (item: ISalesReport, index: number) => (
                            <tr key={index} className="text-center border">
                              <td className="border  border-gray-300 p-2">
                                {item.InvoiceNo}
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {
                                  party?.Items.find(
                                    (val) => val.id === item.PartyId
                                  )?.name
                                }
                              </td>
                              <td className="border  border-gray-300 p-3">
                                {
                                  items?.Items.find(
                                    (val) => val.id === item.ItemId
                                  )?.name
                                }
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {item.Quantity}
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {item.UnitPrice}
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {item.ReturnedQty}
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {item.TaxRate}
                              </td>
                              <td className="border  border-gray-300 p-2">
                                {item.DiscountRate}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td>
                            <p className="text-center text-red-500">
                              {t("No Sales Data Found")}.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                )}
              </div>

              {data?.Items && data.Items.length > 0 && (
                <Pagination
                  form={handleSubmit}
                  pagination={{
                    currentPage: Array.isArray(data) ? 1 : data?.PageIndex ?? 1,
                    firstPage: Array.isArray(data) ? 1 : data?.FirstPage ?? 1,
                    lastPage: Array.isArray(data) ? 1 : data?.LastPage ?? 1,
                    nextPage: Array.isArray(data) ? 1 : data?.NextPage ?? 1,
                    previousPage: Array.isArray(data)
                      ? 1
                      : data?.PreviousPage ?? 1,
                  }}
                  handleSearch={handleSearch}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2  mt-4">
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
        </div>
      </div>
      {showSerial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[30rem] relative">
            <h2 className="text-lg font-semibold mb-4">
              {t("Select Serial Number")}
            </h2>
            <div className="relative h-[76%] ">
              <div ref={containerRef}>
                <input
                  ref={inputRefForSerial}
                  type="text"
                  placeholder={t("Search Serial Number")}
                  defaultValue={searchTermForSerial}
                  onChange={(e) => handleSearchForSerial(e.target.value)}
                  onFocus={() => setDropdownForSerial(true)}
                  className="w-full border rounded px-2 py-2 mb-1"
                />

                {dropdownSerial && (
                  <ul
                    ref={dropdownRefForSerial}
                    className="absolute left-0 top-8 w-full bg-white border rounded shadow z-40 max-h-30 overflow-y-auto py-1 mt-1"
                  >
                    {filteredSerial.map((group) => (
                      <li
                        key={group}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setDropdownForSerial(false);
                          handleSelectSerial(group);
                        }}
                      >
                        {group}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="h-[80%] overflow-y-auto pr-1 mt-2">
                {availableSerialNumbers.length > 0 ? (
                  <div className="space-y-1">
                    {availableSerialNumbers.map((serial, index) => (
                      <div key={index} className="flex items-center py-1">
                        <input
                          type="checkbox"
                          checked={availableSerialNumbers.includes(serial)}
                          className="mr-2"
                          onChange={(e) => handleUnSelectSerial(e, serial)}
                        />
                        <span>{serial}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {t("No Serial Number Found")}.
                  </p>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-6 right-6 flex justify-between">
              <button
                type="button"
                onClick={() => handleAddSerialNo(availableSerialNumbers)}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                {t("Confirm")}
              </button>
              <button
                type="button"
                onClick={handleCloseSerialModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReportForm;
