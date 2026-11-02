import {
  useGetLedgerById,
  useGetLedgerGroupByLedgerGroupId,
} from "../../ledger/hooks";

type Props = {
  ledgerId: string;
};
const LedgerName = ({ ledgerId }: Props) => {
  const { data: ledger } = useGetLedgerById(ledgerId);
  const { data: ledgerGroup } = useGetLedgerGroupByLedgerGroupId(
    ledger?.ledgerGroupId
  );
  return (
    <>
      <span className=" ">{ledgerGroup?.name}</span>
    </>
  );
};
export default LedgerName;
