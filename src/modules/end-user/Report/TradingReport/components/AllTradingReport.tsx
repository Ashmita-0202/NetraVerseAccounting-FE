import { useGetTradingReport } from "../hooks";
import React, { useState, useEffect } from "react";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import {
  IFilterTradingReport,
  ILedgerGroupLevels,
  ITradingReport,
} from "../types/ITradingReport";
import { InputElement } from "@/components/FormComponents/input";
type Props = {
  form: UseFormReturn<IFilterTradingReport>;
};
const AllTradingReportForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const [params, setParams] = useState<string | null>(null);
  const {
    data: allTradingReport,
    isLoading,
    refetch,
  } = useGetTradingReport(params);

  const handleClear = () => {
    refetch();
    setParams("");
    form.reset();
  };
  useEffect(() => {
    if (params !== null) {
      refetch();
    }
  }, [params, refetch]);

  const onSubmit: SubmitHandler<IFilterTradingReport> = (formData) => {
    try {
      const queryParams = [
        formData.fromDate
          ? `fromDate=${encodeURIComponent(formData.fromDate)}`
          : null,
        formData.toDate
          ? `toDate=${encodeURIComponent(formData.toDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `?${queryParams}` : "";
      setParams(fullQuery);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="m-6">
      {isLoading ? (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
              <InputElement
                layout="column"
                label="From Date"
                form={form}
                inputType="date"
                name="fromDate"
                placeholder="Enter Start Date"
              />
              <InputElement
                label="To Date"
                form={form}
                inputType="date"
                name="toDate"
                placeholder="Enter End Date"
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
          <div>
            {allTradingReport?.ExpenseGroups &&
              allTradingReport.ExpenseGroups && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 mb-4 ">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Particular")}
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Balance")}
                        </th>
                        <th className="border border-gray-300 px-2 sm:px-4 py-2">
                          {t("Total Balance")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          "ExpenseGroups",
                          "IncomeGroups",
                        ] as (keyof ITradingReport)[]
                      ).map((groupType) => {
                        const groups = allTradingReport?.[groupType] || [];
                        return groups.length > 0 ? (
                          groups.map(
                            (item: ILedgerGroupLevels, index: number) => (
                              <React.Fragment key={`${groupType}-${index}`}>
                                <tr className="border-t">
                                  <td className="pl-1 pt-2 pb">
                                    <strong>
                                      <LedgerGroupName
                                        ledgerGroupId={item.LedgerGroupId}
                                      />
                                    </strong>
                                  </td>
                                  <td className="text-gray-600">Rs</td>
                                  <td className="text-gray-600">Rs</td>
                                </tr>
                                {item.LedgerItems.map((ledger, gIndex) => (
                                  <tr key={`ledger-${groupType}-${gIndex}`}>
                                    <td className="pl-2">
                                      {ledger.LedgerName}
                                    </td>
                                    <td className="text-gray-400">
                                      <div className="flex">
                                        {ledger.Balance > 0 ? (
                                          <div>{ledger.Balance} Cr</div>
                                        ) : (
                                          <div>
                                            {Math.abs(ledger.Balance)} Dr
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-gray-400"></td>
                                  </tr>
                                ))}
                                <tr className="">
                                  <td className="pl-1 pt-2 pb">
                                    <strong>
                                      Total{" "}
                                      <LedgerGroupName
                                        ledgerGroupId={item.LedgerGroupId}
                                      />
                                    </strong>
                                  </td>
                                  <td className="text-gray-600"></td>
                                  <td className="text-gray-600">
                                    <div className="flex">
                                      {item.GroupTotal > 0 ? (
                                        <div>{item.GroupTotal} Cr</div>
                                      ) : (
                                        <div>
                                          {Math.abs(item.GroupTotal)} Dr
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          )
                        ) : (
                          <tr key={`no-${groupType}`}>
                            <td
                              colSpan={3}
                              className="text-center text-gray-500 py-2"
                            >
                              {t("No data found in")}{" "}
                              {groupType === "ExpenseGroups"
                                ? t("Expenses")
                                : t("Income")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AllTradingReportForm;
