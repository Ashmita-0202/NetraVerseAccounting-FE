import { useGetMasterByMaster } from "@/modules/end-user/account/Master/hooks";

type Props = {
  masterId: string;
};
const MasterName = ({ masterId }: Props) => {
  const { data: master } = useGetMasterByMaster(masterId);
  return (
    <>
      <span className="text-gray-600 text-sm ">{master?.Name}</span>
    </>
  );
};
export default MasterName;
