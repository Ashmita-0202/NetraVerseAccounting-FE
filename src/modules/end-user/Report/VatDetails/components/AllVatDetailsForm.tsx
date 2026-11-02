import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useGetVatDetails } from "../hooks";
import Pagination from "@/hooks/pagination";
import FilterLedgerBalanceForm from "./FilterLedgerBalanceForm";
import { IFilterLedgerBalance } from "../types/IVatDetails";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useTranslation } from "react-i18next";
import { LedgerBalance } from "@/modules/end-user/account/ledger/components/GetBalance";
import ClipLoader from "react-spinners/ClipLoader";
const AllVatDetailsForm = () => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allVatDetails, refetch, isLoading } = useGetVatDetails(query);
  // const [creditTotal, setCreditTotal] = useState(0);
  // const [debitTotal, setDebitTotal] = useState(0);
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const form = useForm<IFilterLedgerBalance>({
    defaultValues: {
      startDate: "",
      endDate: "",
      ledgerId: "",
    },
  });
  const { data: allLedgers } = useGetAllLedgers();
  const [formData, setFormData] = useState<IFilterLedgerBalance>({
    startDate: "",
    endDate: "",
    ledgerId: "",
  });
  useEffect(() => {
    refetch();
    console.log(formData);
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
  const runningBalances: number[] = [];
  let cumulativeBalance = 0;

  if (allVatDetails?.Items) {
    allVatDetails.Items.forEach((item) => {
      if (item?.vatOutWards) {
        const vatValue = item?.vatInWards ?? item?.vatOutWards ?? 0;
        cumulativeBalance += vatValue;
        runningBalances.push(cumulativeBalance);
      } else if (item?.vatInWards) {
        const vatValue = item?.vatInWards ?? item?.vatOutWards ?? 0;
        cumulativeBalance -= vatValue;
        runningBalances.push(cumulativeBalance);
      }
    });
  }

  return (
    <div className="m-6">
      {isLoading ? (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div>
          {(allVatDetails?.Items || []).length > 0 && (
            <FilterLedgerBalanceForm form={form} setFormData={setFormData} />
          )}
          <div className="m-6">
            {Array.isArray(allVatDetails?.Items) &&
            allVatDetails.Items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-4 ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Vat Details")}
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Vat InWards")}
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Vat OutWards")}
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">
                        {t("Balance")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVatDetails.Items.map((item, index) => {
                      return (
                        <tr key={index}>
                          <div className="pl-4">
                            <div className="text-base">{item.type}</div>
                            <p className="text-xs text-gray-500 pl-10">
                              {
                                allLedgers?.Items.find(
                                  (ledger) => ledger.id === item.ledgerId
                                )?.name
                              }
                              {item.ledgerId && (
                                <LedgerBalance ledgerId={item.ledgerId} />
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {" "}
                              {item.billNumbers}
                            </p>
                          </div>

                          <td className="pl-2">
                            {item.vatInWards ? item.vatInWards : "-"}
                          </td>
                          <td className="pl-2">
                            {item.vatOutWards ? item.vatOutWards : "-"}
                          </td>
                          <td className="pl-2">{runningBalances[index]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                {t("No Vat Details found")}.
              </p>
            )}
            {Array.isArray(allVatDetails?.Items) &&
              allVatDetails.Items.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    form={handleSubmit}
                    pagination={{
                      currentPage: Array.isArray(allVatDetails)
                        ? 1
                        : allVatDetails?.PageIndex ?? 1,
                      firstPage: Array.isArray(allVatDetails)
                        ? 1
                        : allVatDetails?.FirstPage ?? 1,
                      lastPage: Array.isArray(allVatDetails)
                        ? 1
                        : allVatDetails?.LastPage ?? 1,
                      nextPage: Array.isArray(allVatDetails)
                        ? 1
                        : allVatDetails?.NextPage ?? 1,
                      previousPage: Array.isArray(allVatDetails)
                        ? 1
                        : allVatDetails?.PreviousPage ?? 1,
                    }}
                    handleSearch={handleSearch}
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AllVatDetailsForm;
