import { useGetItemById } from "../../Item/hooks";

type Props = {
  itemId: string;
};
const ItemName = ({ itemId }: Props) => {
  const { data: item } = useGetItemById(itemId);
  return <div>{item?.name}</div>;
};
export default ItemName;
