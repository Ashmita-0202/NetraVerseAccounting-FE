import { useGetUnitsById } from "../../Units/hooks";

interface Props {
  unitId: string;
}
const GetUnitName = ({ unitId }: Props) => {
  const { data: unitData } = useGetUnitsById(unitId);
  return (
    <div>
      <h1>{unitData.name}</h1>
    </div>
  );
};
export default GetUnitName;
