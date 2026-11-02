import { useGetInventoryItem } from "../hooks";
import { MouseEvent } from "react";
import ItemName from "./ItemName";
import close from "@/assets/xmark-solid.svg";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useTranslation } from "react-i18next";
type Props = {
  itemId: string;
  visible: boolean;
  onClose: () => void;
};
const FilterItemByItem = ({ itemId, visible, onClose }: Props) => {
  const { t } = useTranslation();
  const { data: allLedgers } = useGetAllLedgers();
  const { data: item } = useGetInventoryItem(itemId);
  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "container") {
      onClose();
    }
  };
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
      id="container"
      onClick={handleOnClose}
    >
      <div className="w-[86%] ml-[13%] h-[98%] bg-white p-6 shadow-lg overflow-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex">
            <ItemName itemId={itemId} /> &nbsp; {t("Details")}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-white px-4 py-2 rounded"
          >
            <img src={close} alt="close" className="w-6" />
          </button>
        </div>
        <div className="flex justify-end mb-4">
          {item && item?.length > 0 ? (
            <div>
              {item.map((item) => (
                <div>
                  {item.type === 0 && (
                    <div>
                      <div>
                        {" "}
                        {t("Opening Stock Quantity")} : {item.quantityIn}
                      </div>
                      <div>{item.entryDate}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No opening stock found</div>
          )}
        </div>

        {item && item?.length > 0 ? (
          <div>
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Entry Date")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Type")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Particular")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Quantity In")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Serial Number")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Amount In")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Quantity Out")}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {t("Amount Out")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border text-black">{item.entryDate}</td>
                    <td className="p-2 border">
                      {item.type === 0 ? (
                        <div>None</div>
                      ) : item.type === 1 ? (
                        <div>Purchase</div>
                      ) : (
                        <div> Sales</div>
                      )}
                    </td>
                    <td className="p-2 border">
                      {
                        allLedgers?.Items.find(
                          (ledger) => ledger.id === item.ledgerId
                        )?.name
                      }
                    </td>
                    <td className="p-2 border">
                      <div className="flex">{item.quantityIn}</div>
                    </td>
                    <td className="p-2 border">
                      <div className="flex">
                        {item.serialNumbers.map((item) => (
                          <div>{item} ,</div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 border">{item.amountIn}</td>
                    <td className="p-2 border">{item.quantityOut}</td>
                    <td className="p-2 border">{item.amountOut}</td>
                  </tr>

                  // <LedgerTable ledgerId={ledger.ledgerId} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No LedgerBalance found.
          </p>
        )}
      </div>
    </div>
  );
};
export default FilterItemByItem;
