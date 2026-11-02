import { useGetLedgerGroupByLedgerGroupId } from "@/modules/end-user/account/ledger/hooks";

type Props = {
  ledgerGroupId: string;
};
const LedgerGroupName = ({ ledgerGroupId }: Props) => {
  const { data: ledgerGroup } = useGetLedgerGroupByLedgerGroupId(ledgerGroupId);
  return (
    <>
      <span className="text-gray-400 text-sm ">{ledgerGroup?.name}</span>
    </>
  );
};
export default LedgerGroupName;
