import { useGetLedgerById } from "@/modules/end-user/account/ledger/hooks";

type Props = {
  ledgerId: string;
};
const LedgerName = ({ ledgerId }: Props) => {
  const { data: ledger } = useGetLedgerById(ledgerId);
  return (
    <>
      <span className=" ">{ledger?.name}</span>
    </>
  );
};
export default LedgerName;
