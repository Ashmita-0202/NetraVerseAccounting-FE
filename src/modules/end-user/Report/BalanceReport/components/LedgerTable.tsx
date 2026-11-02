import { useGetLedgerSummaryByLedger } from "../hooks";
import { useState, useEffect } from "react";
import { ILedgerSummary } from "../types/ILedgerBalance";
import Pagination from "@/hooks/pagination";
import { useForm } from "react-hook-form";
import close from "@/assets/xmark-solid.svg";
import { MouseEvent } from "react";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useTranslation } from "react-i18next";
type Props = {
  ledgerId: string;
  visible: boolean;
  onClose: () => void;
};
const LedgerTable = ({ ledgerId, visible, onClose }: Props) => {
  const { t } = useTranslation();
  const { data: allLedgers } = useGetAllLedgers();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: true,
    ledgerSummary: [] as ILedgerSummary[],
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
    updateState({ loading: true, ledgerSummary: [] });
  };

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const {
    data: ledgerSummary,
    refetch,
    isLoading,
    isFetching,
    error,
  } = useGetLedgerSummaryByLedger(ledgerId, query);

  const getLedgerSummaryArray = (): ILedgerSummary[] => {
    return ledgerSummary?.Items ?? [];
  };
  useEffect(() => {
    setState({
      loading: false,
      ledgerSummary: getLedgerSummaryArray(),
      errorMessage: error ? "Failed to fetch ledgerSummary" : "",
    });
  }, [ledgerSummary, error]);

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "container") {
      onClose();
    }
  };

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      id="container"
      onClick={handleOnClose}
    >
      <div className="w-screen ml-[11.5%] h-screen bg-white p-6  overflow-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">{t("Ledger Balance Sheet")}</h1>
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl hover:text-red-500 "
          >
            <img src={close} alt="close" className="w-8 h-7" />
          </button>
        </div>
        {isLoading || isFetching ? (
          <div>{t("Data Loading")}...</div>
        ) : (
          <div>
            {ledgerSummary?.Items && ledgerSummary.Items.length > 0 ? (
              <div className="">
                <div className="w-full border-collapse border border-gray-300 mb-4">
                  <div className="flex bg-gray-200">
                    <div className="border border-gray-300 px-2 sm:px-4 py-2 w-1/2">
                      {t("Debit Amount")}
                    </div>
                    <div className="border border-gray-300 px-2 sm:px-4 py-2 w-1/2">
                      {t("Credit Amount")}
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className=" w-1/2">
                      {ledgerSummary?.Items?.filter(
                        (item) => item.debitAmount && item.ledgerId !== ledgerId
                      ).map((item, index) => (
                        <div key={index} className="flex w-full border-b p-2">
                          <div className="flex justify-between">
                            <span>{item.debitAmount} &nbsp;</span>
                            <span className="text-gray-500">
                              (
                              {
                                allLedgers?.Items.find(
                                  (i) => i.id === item.ledgerId
                                )?.name
                              }
                              )
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className=" w-1/2">
                      {ledgerSummary?.Items?.filter(
                        (item) => item.creditAmout && item.ledgerId !== ledgerId
                      ).map((item, index) => (
                        <div
                          key={index}
                          className="flex w-full border-b p-2 border-l"
                        >
                          <div className="flex justify-between">
                            <span>{item.creditAmout} &nbsp;</span>
                            <span className="text-gray-500">
                              (
                              {
                                allLedgers?.Items.find(
                                  (i) => i.id === item.ledgerId
                                )?.name
                              }
                              )
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>{t("Ledger Balance Not Found")}</div>
            )}
          </div>
        )}

        {state.ledgerSummary.length > 0 && (
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(ledgerSummary)
                ? 1
                : ledgerSummary?.PageIndex ?? 1,
              firstPage: Array.isArray(ledgerSummary)
                ? 1
                : ledgerSummary?.FirstPage ?? 1,
              lastPage: Array.isArray(ledgerSummary)
                ? 1
                : ledgerSummary?.LastPage ?? 1,
              nextPage: Array.isArray(ledgerSummary)
                ? 1
                : ledgerSummary?.NextPage ?? 1,
              previousPage: Array.isArray(ledgerSummary)
                ? 1
                : ledgerSummary?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
};
export default LedgerTable;
