import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useGetBalanceSheet } from "../hooks";
import Pagination from "@/hooks/pagination";
import { IBalanceSheet, ILedgerGroupLevels } from "../types/IBalanceSheet";
import { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import { useGetAllMaster } from "@/modules/end-user/account/Master/hooks";
import ClipLoader from "react-spinners/ClipLoader";
const AllBalanceSheetForm = () => {
  const { t } = useTranslation();
  const { data: allLedgers } = useGetAllLedgers();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();
  const { data: AllMaster } = useGetAllMaster();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const {
    data: allBalanceSheet,
    refetch,
    isLoading,
  } = useGetBalanceSheet(query);
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleSearch = (params: SearchParam) => {
    setPaginationParams((prev) => ({
      ...prev,
      ...params,
    }));
  };

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  // useEffect(() => {
  //   if (allBalanceSheet?.Items) {
  //     let total = 0;
  //     allBalanceSheet.Items.forEach((item) => {
  //       total += item.balance
  //     });

  //   }
  // }, [allBalanceSheet]);

  return (
    <div className="m-6">
      {isLoading ? (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div>
          {allBalanceSheet && allBalanceSheet.Items.length === 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t(
                        `${
                          AllMaster?.Items.find(
                            (item) =>
                              item.id === allBalanceSheet.Items[0].masterId
                          )?.Name
                        }`
                      )}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Balance")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t(
                        `${
                          AllMaster?.Items.find(
                            (item) =>
                              item.id === allBalanceSheet.Items[1].masterId
                          )?.Name
                        }`
                      )}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Balance")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const assetMaster = allBalanceSheet.Items[0];
                    const liabilityMaster = allBalanceSheet.Items[1];
                    const flattenSide = (master: IBalanceSheet) => {
                      const rows: { name: JSX.Element; balance: number }[] = [];
                      master.LedgerGroupLevelBalanceSheetResponses.forEach(
                        (group: ILedgerGroupLevels) => {
                          rows.push({
                            name: (
                              <div>
                                {
                                  AllLedgerGroup?.Items.find(
                                    (item) => item.id === group.ledgerGroupId
                                  )?.name
                                }
                              </div>
                            ),
                            balance: group.balance,
                          });
                          group.LedgerLevelBalanceSheetResponses.forEach(
                            (ledger) => {
                              rows.push({
                                name: (
                                  <div className="pl-4">
                                    {
                                      allLedgers?.Items.find(
                                        (i) => i.id === ledger.ledgerId
                                      )?.name
                                    }
                                  </div>
                                ),
                                balance: ledger.balance,
                              });
                            }
                          );
                        }
                      );
                      return rows;
                    };

                    const assetRows = flattenSide(assetMaster);
                    const liabilityRows = flattenSide(liabilityMaster);

                    const maxRows = Math.max(
                      assetRows.length,
                      liabilityRows.length
                    );

                    const rows = [];
                    for (let i = 0; i < maxRows; i++) {
                      const assetRow = assetRows[i] || {
                        name: "",
                        balance: "",
                      };
                      const liabilityRow = liabilityRows[i] || {
                        name: "",
                        balance: "",
                      };

                      rows.push(
                        <tr key={i}>
                          <td className="px-2 py-1">{assetRow.name}</td>
                          <td className="border-x border-gray-300 px-2 py-1 text-right">
                            {assetRow.balance > 0 ? (
                              <div>{assetRow.balance} Cr</div>
                            ) : (
                              <div>{Math.abs(assetRow.balance)} Dr</div>
                            )}
                          </td>
                          <td className="border-r border-gray-300 px-2 py-1">
                            {liabilityRow.name}
                          </td>
                          <td className="border-x border-gray-300 px-2 py-1 text-right">
                            {liabilityRow.balance > 0 ? (
                              <div>{liabilityRow.balance} Cr</div>
                            ) : (
                              <div>{Math.abs(liabilityRow.balance)} Dr</div>
                            )}
                          </td>
                        </tr>
                      );
                    }

                    return rows;
                  })()}
                </tbody>
              </table>
              <div className="flex  justify-between">
                <div>
                  {t("Total Liabilities")} {allBalanceSheet.Items[1].balance}
                </div>
                <div>
                  {t("Total Assets")} {allBalanceSheet.Items[0].balance}
                </div>
              </div>
            </div>
          ) : (
            <div>{t("No Balance Sheet Found")}</div>
          )}
          {Array.isArray(allBalanceSheet?.Items) &&
            allBalanceSheet.Items.length > 0 && (
              <div className="mt-4">
                <Pagination
                  form={handleSubmit}
                  pagination={{
                    currentPage: paginationParams.pageIndex,
                    firstPage: 1,
                    lastPage: allBalanceSheet?.LastPage ?? 1,
                    nextPage:
                      allBalanceSheet?.NextPage ??
                      paginationParams.pageIndex + 1,
                    previousPage:
                      allBalanceSheet?.PreviousPage ??
                      paginationParams.pageIndex - 1,
                  }}
                  handleSearch={handleSearch}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
};
export default AllBalanceSheetForm;
