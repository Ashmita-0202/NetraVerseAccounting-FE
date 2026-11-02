import { useGetItemById } from "../../Item/hooks";
import { useGetUnitsById } from "../../Units/hooks";

type Props = {
  itemId: string;
};
const UnitName = ({ itemId }: Props) => {
  const { data: item } = useGetItemById(itemId);
  const { data: unit } = useGetUnitsById(item?.unitId);
  return <div>{unit?.name}</div>;
};
export default UnitName;
