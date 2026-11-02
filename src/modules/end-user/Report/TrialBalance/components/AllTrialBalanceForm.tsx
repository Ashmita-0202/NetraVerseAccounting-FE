import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useGetTrialBalance } from "../hooks";
import Pagination from "@/hooks/pagination";
import React from "react";
import MasterName from "./MasterName";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import LedgerName from "../../BalanceReport/components/LedgerName";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllTrialBalanceForm = () => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const {
    data: allTrialBalance,
    refetch,
    isLoading,
  } = useGetTrialBalance(query);
  const [creditTotal, setCreditTotal] = useState(0);
  const [debitTotal, setDebitTotal] = useState(0);
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
  useEffect(() => {
    if (allTrialBalance?.Items) {
      let debitSum = 0;
      let creditSum = 0;
      allTrialBalance.Items.forEach((item) => {
        debitSum += item.debitAmount;
        creditSum += item.creditAmount;
      });

      // Update the state with the calculated totals
      setDebitTotal(debitSum);
      setCreditTotal(creditSum);
    }
  }, [allTrialBalance]);

  return (
    <div className="m-6">
      {isLoading ? (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div>
          {Array.isArray(allTrialBalance?.Items) &&
          allTrialBalance.Items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-4 ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Particular")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Debit")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Credit")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTrialBalance.Items.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr className="border-t ">
                        <td className="pl-1 pt-2 pb">
                          <strong>
                            <MasterName masterId={item.masterId} />
                          </strong>
                        </td>
                        <td className="text-gray-600">{item.debitAmount}</td>
                        <td className="text-gray-600">{item.creditAmount}</td>
                      </tr>
                      {item.ledgerGroupLevels.map((group, gIndex) => (
                        <React.Fragment key={gIndex}>
                          <tr>
                            <td className="pl-2">
                              <LedgerGroupName
                                ledgerGroupId={group.ledgerGroupId}
                              />
                            </td>
                            <td className="text-gray-400 ">
                              {" "}
                              {group.debitAmount ? group.debitAmount : "-"}
                            </td>
                            <td className="text-gray-400 ">
                              {group.creditAmount ? group.creditAmount : "-"}
                            </td>
                          </tr>
                          {group.ledgersLevels.map((ledger, lIndex) => (
                            <tr key={lIndex}>
                              <div className="pl-4">
                                <LedgerName ledgerId={ledger.ledgerId} />
                              </div>

                              <td>
                                {ledger.debitAmount ? ledger.debitAmount : "-"}
                              </td>
                              <td>
                                {ledger.creditAmount
                                  ? ledger.creditAmount
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {t("No Trial Balance found")}.
            </p>
          )}
          {Array.isArray(allTrialBalance?.Items) &&
            allTrialBalance.Items.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between">
                  <div className="font-semibold">{t("Total Debit")}: </div>
                  <div>{debitTotal}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-semibold">{t("Total Credit")}: </div>
                  <div>{creditTotal}</div>
                </div>
              </div>
            )}
          {Array.isArray(allTrialBalance?.Items) &&
            allTrialBalance.Items.length > 0 && (
              <div className="mt-4">
                <Pagination
                  form={handleSubmit}
                  pagination={{
                    currentPage: paginationParams.pageIndex,
                    firstPage: 1,
                    lastPage: allTrialBalance?.LastPage ?? 1,
                    nextPage:
                      allTrialBalance?.NextPage ??
                      paginationParams.pageIndex + 1,
                    previousPage:
                      allTrialBalance?.PreviousPage ??
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
export default AllTrialBalanceForm;
