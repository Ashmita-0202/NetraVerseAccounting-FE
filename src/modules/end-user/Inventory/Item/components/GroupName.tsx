import { useGetItemGroupById } from "../../ItemGroup/hooks";
import { useGetUnitsById } from "../../Units/hooks";

type PropsItem = {
  ItemGroupId: string;
};
type PropsUnit = {
  UnitId?: string;
};

export const ItemGroupName = ({ ItemGroupId }: PropsItem) => {
  const { data: itemGroup } = useGetItemGroupById(ItemGroupId);
  if (!itemGroup) return <div>Loading...</div>;
  return <div>{itemGroup.name ?? "No ItemGroup"}</div>;
};

export const UnitName = ({ UnitId }: PropsUnit) => {
  const { data: unit } = useGetUnitsById(UnitId);

  if (!unit) return <div>Loading...</div>;

  return <div>{unit.name ?? "No Name"}</div>;
};
