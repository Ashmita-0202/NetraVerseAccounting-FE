import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { DeleteButton } from "@/components/common/DeleteButton";
import {
  useGetAllPurchaseReturn,
  useRemovePurchaseReturnDetails,
} from "../hooks";
import { IPurchaseReturn } from "../types/IPurchaseReturn";
import PurchaseReturnDetails from "./PurchaseReturnDetails";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllPurchaseReturnForm = () => {
  const { t } = useTranslation();
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllPurchaseReturn();
  const purchaseData = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.items || apiResponse?.Items || [];
  const { data: allLedgers } = useGetAllLedgers();
  const { mutateAsync: deletePurchaseReturn } =
    useRemovePurchaseReturnDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchaseReturnId, setSelectedPurchaseReturnId] = useState<
    string | undefined
  >("");

  const filteredPurchaseData = purchaseData.filter((item: IPurchaseReturn) => {
    return (
      item.ledgerId &&
      Array.isArray(allLedgers?.Items) &&
      allLedgers.Items.some((ledger) => ledger.id === item.ledgerId)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePurchaseReturn(id);
      refetch();
    } catch (error) {
      console.error("Error deleting purchase return:", error);
    }
  };

  const handleViewClick = (purchase: string) => {
    setSelectedPurchaseReturnId(purchase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchaseReturnId("");
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
                {t("Total Quantity")}
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
            {Array.isArray(filteredPurchaseData) &&
            filteredPurchaseData.length > 0 ? (
              filteredPurchaseData.map((item: IPurchaseReturn, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.returnDate || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {allLedgers?.Items.find(
                        (ledger) => ledger.id === item.ledgerId
                      )?.name || "N/A"}
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
                    {Array.isArray(filteredPurchaseData)
                      ? `${t("No Valid Purchase Return Records Found")}`
                      : "Data format error. Expected an array."}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedPurchaseReturnId && (
        <PurchaseReturnDetails
          purchaseReturnId={selectedPurchaseReturnId}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllPurchaseReturnForm;
