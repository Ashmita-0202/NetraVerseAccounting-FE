import { useEffect, useState } from "react";
import { useGetInventoryItem } from "../hooks";

type Props = {
  itemId: string;
  onValueCalculated: (value: number) => void;
};

const GetValueField = ({ itemId, onValueCalculated }: Props) => {
  const { data: item } = useGetInventoryItem(itemId);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (item && item.length > 0) {
      const total = item.reduce((sum, item) => {
        if (item.quantityIn > 0) {
          return sum + Number(item.quantityIn) * Number(item.amountIn);
        }
        return sum;
      }, 0);
      setTotalValue(total);
    } else {
      setTotalValue(0);
    }
  }, [item]);
  useEffect(() => {
    onValueCalculated(totalValue);
  }, [totalValue]);

  return (
    <div>
      {item && item.length > 0 ? (
        <div>{totalValue}</div>
      ) : (
        <div>No Transaction done</div>
      )}
    </div>
  );
};

export default GetValueField;
