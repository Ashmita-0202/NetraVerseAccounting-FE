import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useGetAllSalesReturn, useRemoveSalesReturnDetails } from "../hooks";
import { ISalesReturn } from "../types/ISalesReturn";
// import { useGetAllCompany } from "@/modules/admin/Company/hooks";
import SalesReturnDetails from "./SalesReturnDetails";
import LedgerName from "@/modules/end-user/account/Journal/components/LedgerGroup";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllSalesReturnForm = () => {
  const { t } = useTranslation();
  const {
    data: apiResponse,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSalesReturn();
  const salesData = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.items || apiResponse?.Items || [];

  const { mutateAsync: deleteSalesReturn } = useRemoveSalesReturnDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalesReturnId, setSelectedSalesReturnId] = useState<
    string | undefined
  >("");

  const handleDelete = async (id: string) => {
    try {
      await deleteSalesReturn(id);
      refetch();
    } catch (error) {
      console.error("Error deleting sales return:", error);
    }
  };

  const handleViewClick = (sales: string) => {
    setSelectedSalesReturnId(sales);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSalesReturnId("");
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isFetching || isLoading) {
    return (
      <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {t("Failed to Load Sales Return Data")}.
        <button
          onClick={() => refetch()}
          className="ml-2 text-blue-600 hover:underline"
        >
          {t("Retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 ml-2 w-[99%] bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("SN")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Date")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Party Name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Total Amount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Net Return Amount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Tax Adjustment")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(salesData) && salesData.length > 0 ? (
              salesData.map((item: ISalesReturn, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-md font-bold ">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.returnDate || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.ledgerId ? (
                        <LedgerName ledgerId={item.ledgerId} />
                      ) : (
                        <div>Unknown Ledger</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.totalQuantity || "N/A"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.netReturnAmount
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "NPR",
                        }).format(Number(item.netReturnAmount))
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.taxAdjustment || 0}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        className="text-green-500 hover:text-green-300 flex items-center"
                        onClick={() => handleViewClick(item.id)}
                      >
                        <FaEye className="w-4 h-4 mr-1" />
                        {t("View")}
                      </button>
                      <DeleteButton
                        handleDelete={() => handleDelete(item.id)}
                        isLoading={false}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="text-gray-500">
                    {Array.isArray(salesData)
                      ? `${t("No Sales Return Records Found")}.`
                      : "Data format error. Expected an array."}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedSalesReturnId && (
        <SalesReturnDetails
          salesReturnId={selectedSalesReturnId}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllSalesReturnForm;
