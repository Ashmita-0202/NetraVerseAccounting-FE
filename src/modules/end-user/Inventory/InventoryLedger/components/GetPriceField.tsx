import { useGetInventoryItem } from "../hooks";
import UnitName from "./UnitName";

type Props = {
  itemId: string;
};
const GetPriceField = ({ itemId }: Props) => {
  const { data: item } = useGetInventoryItem(itemId);
  return (
    <div>
      {item && item?.length > 0 ? (
        <div>
          {item.map((item) => (
            <div>
              {item.amountIn > 0 && (
                <div className="flex">
                  {item.quantityIn} &nbsp; <UnitName itemId={item.itemId} />{" "}
                  &nbsp; @{item.amountIn}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No Transaction done</div>
      )}
    </div>
  );
};
export default GetPriceField;
