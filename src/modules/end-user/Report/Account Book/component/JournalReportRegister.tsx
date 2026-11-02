import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { IJournalReport, IJournalReportResponse } from "../types/IReport";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useEffect, useRef, useState } from "react";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import { useGetJournalRegisterByLedger } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import Pagination from "@/hooks/pagination";
import { useGetAllCompany } from "@/modules/admin/Company/hooks";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllMaster } from "@/modules/end-user/account/Master/hooks";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  form: UseFormReturn<IJournalReport>;
};

const JournalReportRegisterForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, SetState] = useState({
    Loading: false,
    journalReport: [] as IJournalReportResponse[],
    errorMessage: "",
  });
  type SearchParams = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [, setIsPrinting] = useState(false);
  const { data: allLedgers } = useGetAllLedgers();
  const { data: company } = useGetAllCompany();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();

  const companyMap = new Map(
    company?.Items.map((company) => [company.id, company.name])
  );

  const [params, setParams] = useState<string | null>(null);
  const handleSearch = (params: SearchParams) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ Loading: true, journalReport: [] });
  };
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [selectedLedgerGroupId, setSelectedLedgerGroupId] = useState("");
  const { data: AllMaster } = useGetAllMaster();
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&isPagination=${paginationParams.isPagination}`;
  const { data, error, refetch, isLoading, isFetching } =
    useGetJournalRegisterByLedger(query + (params || ""));
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
          .save("purchaseReport.pdf")
          .finally(() => {
            setPaginationParams(originalPaginationParams);
            setIsPrinting(false);
          });
      }
    }, 100);
  };

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
      XLSX.utils.book_append_sheet(wb, ws, "journal Report");
      XLSX.writeFile(wb, "journalReport.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setPaginationParams(originalPagination);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error, refetch]);

  const updateState = (updates: Partial<typeof state>) => {
    SetState((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = useForm<IJournalReport>({
    defaultValues: {
      ledgerId: "",
      ledgerGroupId: "",
      startDate: "",
      endDate: "",
    },
  });
  const handleClear = () => {
    refetch();
    form.reset();
    setSelectedLedgerGroupId("");
    setSelectedLedgerId("");
  };
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerId", ledgerId);
  };

  const handleSelectLedgerGroup = (ledgerGroupId: string) => {
    form.setValue("ledgerGroupId", ledgerGroupId);
  };
  const onSubmit: SubmitHandler<IJournalReport> = async (formData) => {
    try {
      const queryParams = [
        formData.ledgerGroupId
          ? `ledgerGroupId=${encodeURIComponent(formData.ledgerGroupId)}`
          : null,
        formData.ledgerId
          ? `ledgerId=${encodeURIComponent(formData.ledgerId)}`
          : null,
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
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  return (
    <div className="p-2 h-full">
      {state.Loading && (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}

      <div className="p-6 bg-white rounded-lg shadow-md h-full">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-5 gap-5 p-6 bg-gray-100 rounded-md"
        >
          <div className="">
            {allLedgers && (
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Ledger"
                options={allLedgers.Items}
                value={selectedLedgerId}
                selected={
                  allLedgers.Items.find((g) => g.id === selectedLedgerId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedLedgerId(group.id);
                    handleSelectLedger(group.id || "");
                  } else {
                    setSelectedLedgerId("");
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                renderOptionExtra={(g) => (
                  <div>
                    {
                      AllLedgerGroup?.Items.find(
                        (item) => item.id === g?.ledgerGroupId
                      )?.name
                    }
                  </div>
                )}
              />
            )}
          </div>
          <div className="">
            {AllLedgerGroup && (
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Ledger Group"
                options={AllLedgerGroup.Items}
                value={selectedLedgerGroupId}
                selected={
                  AllLedgerGroup.Items.find(
                    (g) => g.id === selectedLedgerGroupId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedLedgerGroupId(group.id);
                    handleSelectLedgerGroup(group.id || "");
                  } else {
                    setSelectedLedgerGroupId("");
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                renderOptionExtra={(g) => (
                  <div>
                    {
                      AllMaster?.Items.find((item) => item.id === g?.masterId)
                        ?.Name
                    }
                  </div>
                )}
              />
            )}
          </div>
          <div className="mt-1">
            <InputElement
              label="Start Date"
              form={form}
              name="startDate"
              inputType="date"
              placeholder="Start Date"
            />
          </div>
          <div className="mt-1">
            <InputElement
              label="End Date"
              form={form}
              name="endDate"
              inputType="date"
              placeholder="End Date"
            />
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
        <div className="w-full flex items-center justify-center z-50">
          <div className="w-full h-[98%] bg-white p-4 shadow-lg overflow-auto relative">
            <div ref={tableRef}>
              <div className="overflow-x-auto">
                {isLoading || isFetching ? (
                  <div>{t("Data Loading")}...</div>
                ) : (
                  <div>
                    {data?.Items && data?.Items.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200 text-lg">
                            <th className="border p-4">{t("Date")}</th>
                            <th className="border p-3">{t("Ledger")}</th>
                            <th className="border p-3">
                              {t("Credit Amount")}t
                            </th>
                            <th className="border p-3">{t("Debit Amount")}</th>
                            <th className="border p-3">{t("Company")}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {data.Items.map((item, index: number) => (
                            <tr key={index} className="text-center border">
                              <td className="border p-3">
                                {item.transactionDate}
                              </td>

                              <td className="border p-3">
                                {
                                  allLedgers?.Items.find(
                                    (i) => i.id === item.ledgerId
                                  )?.name
                                }
                              </td>
                              <td className="border p-3">
                                {item.creditAmount}
                              </td>
                              <td className="border p-3">{item.debitAmount}</td>
                              <td className="border p-3">
                                {companyMap.get(item.companyId) ||
                                  item.companyId}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : selectedLedgerGroupId === "" &&
                      selectedLedgerId === "" ? (
                      <div>{t("Please Fill the Required Criteria")}</div>
                    ) : (
                      <p className="text-center text-red-500">
                        {t("No Journal Data Found")}.
                      </p>
                    )}
                  </div>
                )}
              </div>
              {data?.Items && data?.Items.length > 0 && (
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
            <div className="flex justify-end space-x-2 mt-4">
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
    </div>
  );
};
export default JournalReportRegisterForm;
