import { useTranslation } from "react-i18next";
import { useGetPurchaseReturnById } from "../hooks";
import close from "@/assets/xmark-solid.svg";
type Props = {
  purchaseReturnId: string;
  handleCloseModal: () => void;
};
const PurchaseReturnDetails = ({
  purchaseReturnId,
  handleCloseModal,
}: Props) => {
  const { t } = useTranslation();
  const { data: PurchaseReturn } = useGetPurchaseReturnById(purchaseReturnId);
  return (
    <div>
      {PurchaseReturn && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-xl shadow-xl max-w-4xl w-full overflow-auto">
            <div className="top-1 right-1 flex justify-end">
              <button onClick={handleCloseModal} className="h-6 w-6">
                <img src={close} alt="close" />
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-6 border-b-2 border-gray-300 pb-4">
              {t("Purchase Return Details")}
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Purchase Details ID")}:</span>
                <span className="font-light">
                  {PurchaseReturn.purchaseDetailsId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Return Date")}:</span>
                <span className="font-light">
                  {new Date(PurchaseReturn.returnDate).toLocaleDateString() ||
                    "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Net Return Amount")}:</span>
                <span className="font-light">
                  {PurchaseReturn.netReturnAmount || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Tax Adjustment")}:</span>
                <span className="font-light">
                  {PurchaseReturn.taxAdjustment || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Net Return Amount")}:</span>
                <span className="font-light">
                  {PurchaseReturn.netReturnAmount || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>{t("Reason")}</span>
                <span className="font-light">
                  {PurchaseReturn.reason || "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-8 border-t-2 border-gray-300 pt-6">
              <h3 className="font-semibold text-xl mb-4">
                {t("Returned Items")}
              </h3>
              {PurchaseReturn.PurchaseReturnItems?.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Item ID:</span>
                    <span className="font-light">
                      {item.purchaseItemsId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>{t("Return Quantity")}:</span>
                    <span className="font-light">
                      {item.returnQuantity || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>{t("Return Unit Price")}:</span>
                    <span className="font-light">
                      {item.returnUnitPrice || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>{t("Return Total Price")}:</span>
                    <span className="font-light">
                      {item.returnTotalAmount || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PurchaseReturnDetails;
