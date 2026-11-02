import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { IFilterLedgerBalance } from "../types/ILedgerBalance";
import { useState, useEffect } from "react";
import { useGetFilterLedgerBalance } from "../hooks";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import Pagination from "@/hooks/pagination";
import LedgerTable from "./LedgerTable";
import { EditButton } from "@/components/common/EditButton";
import { ILedgers } from "@/modules/end-user/account/ledger/types/ILedgers";
import { useTranslation } from "react-i18next";
import { AppCombobox } from "@/components/common/ComboBox";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { InputElement } from "@/components/FormComponents/input";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  form: UseFormReturn<IFilterLedgerBalance>;
};
const AllLedgerBalanceForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const [state, setState] = useState({
    Loading: false,
    journalReport: [] as ILedgers[],
    errorMessage: "",
  });
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const [params, setParams] = useState<string | null>(null);
  const { data: allLedgers } = useGetAllLedgers();
  const {
    data: filterLedgerBalance,
    refetch,
    error,
    isFetching,
    isLoading,
  } = useGetFilterLedgerBalance(query + (params || ""));
  const [selectedLedgerId, setSelectedLedgerId] = useState("");

  const handleClear = () => {
    refetch();
    form.reset();
    setSelectedLedgerId("");
  };

  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerId", ledgerId);
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
  const handleSubmit = useForm<IFilterLedgerBalance>({
    defaultValues: {
      ledgerId: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error, refetch]);

  const onSubmit: SubmitHandler<IFilterLedgerBalance> = async (formData) => {
    try {
      const queryParams = [
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
  const [showLedgerBalance, setShowLedgerBalance] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowLedgerBalance(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  return (
    <div className="m-6">
      {state.Loading && (
        <p className="text-center text-blue-600">{t("Data Loading")}...</p>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {filterLedgerBalance?.Items &&
        filterLedgerBalance?.Items.length === 0 && (
          <div className="text-red-500  justify-end flex">
            No Filtered Ledger found
          </div>
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
            <div className="">
              {allLedgers && (
                <AppCombobox
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Ledger"
                  required
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
        <div>
          {isLoading || isFetching ? (
            <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <ClipLoader color="#36d7b7" size={50} />
            </div>
          ) : (
            <div>
              {filterLedgerBalance && filterLedgerBalance?.Items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 mb-4 ">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Ledger")}
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Closing Balance")}
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterLedgerBalance?.Items.map((ledger) => (
                        <tr key={ledger.ledgerId}>
                          <td className="p-2 border text-black">
                            {
                              allLedgers?.Items.find(
                                (item) => item.id === ledger.ledgerId
                              )?.name
                            }
                          </td>
                          <td className="p-2 border">
                            <div className="flex">
                              {ledger.balance > 0 ? (
                                <div>{ledger.balance} Cr</div>
                              ) : (
                                <div>{Math.abs(ledger.balance)} Dr</div>
                              )}
                            </div>
                          </td>
                          <td className="p-2 border">
                            <div>
                              <EditButton
                                button={buttonElement(ledger.ledgerId ?? "")}
                              />
                            </div>
                            {selectedId && selectedId !== "" && (
                              <LedgerTable
                                visible={showLedgerBalance}
                                onClose={() => setShowLedgerBalance(false)}
                                ledgerId={selectedId}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {t("No Balance Report Found")}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {Array.isArray(filterLedgerBalance?.Items) &&
        filterLedgerBalance.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: paginationParams.pageIndex,
                firstPage: 1,
                lastPage: filterLedgerBalance?.LastPage ?? 1,
                nextPage:
                  filterLedgerBalance?.NextPage ??
                  paginationParams.pageIndex + 1,
                previousPage:
                  filterLedgerBalance?.PreviousPage ??
                  paginationParams.pageIndex - 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
    </div>
  );
};
export default AllLedgerBalanceForm;
